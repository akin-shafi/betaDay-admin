/* eslint-disable no-unused-vars */
"use client";

/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Modal, Select } from "antd";
import { useFetchBusinessGroups } from "@/hooks/useBusiness";
import { useSession } from "@/hooks/useSession";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";
import { useDescriptionSuggestion } from "@/hooks/useDescriptionSuggestion";
import PropTypes from "prop-types";

const { Option } = Select;

export default function AddBusinessModal({ isVisible, onCancel, onFinish }) {
  const [businessTypes, setBusinessTypes] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingBanks, setIsFetchingBanks] = useState(false);
  const [isResolvingAccount, setIsResolvingAccount] = useState(false);
  const [suggestionError, setSuggestionError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const { session } = useSession();
  const addressInputRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [error, setError] = useState(null);

  // Form state with latitude, longitude, and new fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactNumber: "",
    website: "",
    address: "",
    city: "",
    state: "",
    localGovernment: "",
    latitude: null,
    longitude: null,
    openingTime: "08:00",
    closingTime: "18:00",
    businessDays: "",
    deliveryOptions: ["In-house"],
    businessType: "",
    accountNumber: "",
    bankName: "",
    bankCode: "",
    accountName: "",
    isActive: true,
  });

  // Use address autocomplete hook
  const {
    input: addressInput,
    setInput: setAddressInput,
    suggestions,
    loading: addressLoading,
    debouncing,
    error: addressError,
  } = useAddressAutocomplete();

  // Use description suggestion hook (only fetch when triggered by button)
  const [fetchSuggestion, setFetchSuggestion] = useState(false);
  const { suggestedDescription, isLoading: suggestionLoading } =
    useDescriptionSuggestion({
      businessType: formData.businessType,
      businessName: formData.name,
    });

  // Fetch business groups when the modal is opened
  const {
    groups: fetchedGroups,
    loading: groupsLoading,
    error: groupsError,
  } = useFetchBusinessGroups(session?.token, isVisible);

  // Fetch banks when modal is opened
  useEffect(() => {
    const fetchBanks = async () => {
      setIsFetchingBanks(true);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL || "https://betapadi.onrender.com"
          }/api/banks`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch banks");
        }

        const data = await response.json();
        setBanks(data.data);
      } catch (error) {
        setFormErrors((prev) => ({
          ...prev,
          bankName: "Failed to load banks. Please try again.",
        }));
      } finally {
        setIsFetchingBanks(false);
      }
    };

    if (isVisible) {
      fetchBanks();
    }
  }, [isVisible]);

  useEffect(() => {
    setBusinessTypes(fetchedGroups);
    setLoading(groupsLoading);
    setError(groupsError || null);
  }, [fetchedGroups, groupsLoading, groupsError]);

  // Sync formData.address with addressInput
  useEffect(() => {
    if (formData.address !== addressInput) {
      setAddressInput(formData.address);
    }
  }, [formData.address, addressInput, setAddressInput]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply suggested description when available
  useEffect(() => {
    if (fetchSuggestion && suggestedDescription && !suggestionLoading) {
      setFormData((prev) => ({ ...prev, description: suggestedDescription }));
      setFetchSuggestion(false); // Reset trigger
    }
  }, [suggestedDescription, suggestionLoading, fetchSuggestion]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "address") {
      setAddressInput(value);
      setShowSuggestions(value.trim().length > 0);
      setActiveSuggestionIndex(-1);
    }
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle bank selection
  const handleBankChange = (value) => {
    const selectedBank = banks.find((bank) => bank.name === value);
    setFormData((prev) => ({
      ...prev,
      bankName: value,
      bankCode: selectedBank ? selectedBank.code : "",
      accountName: "", // Reset account name when bank changes
    }));
    if (formErrors.bankName) {
      setFormErrors((prev) => ({ ...prev, bankName: "" }));
    }
  };

  // Handle delivery options (single select)
  const handleDeliveryOptionsChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      deliveryOptions: [value],
    }));
  };

  // Handle suggestion selection for address
  const handleSuggestionSelect = (suggestion) => {
    // Reformat localGovernment: replace '/' or spaces with '-'
    const formatLocalGovernment = (localGov) => {
      if (!localGov) return "";
      return localGov.replace(/\/|\s+/g, "-");
    };

    setFormData((prev) => ({
      ...prev,
      address: suggestion.description,
      city: formatLocalGovernment(suggestion.details?.localGovernment) || "",
      state: suggestion.details?.state || "",
      localGovernment:
        formatLocalGovernment(suggestion.details?.localGovernment) || "",
      latitude:
        suggestion.details?.latitude !== undefined
          ? Number(suggestion.details.latitude)
          : null,
      longitude:
        suggestion.details?.longitude !== undefined
          ? Number(suggestion.details.longitude)
          : null,
    }));
    setAddressInput(suggestion.description);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  // Handle keyboard navigation for address suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          handleSuggestionSelect(suggestions[activeSuggestionIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle description suggestion fetch
  const handleDescriptionSuggestion = () => {
    if (!formData.businessType) {
      setSuggestionError("Please select a business group");
      return;
    }
    setSuggestionError(null);
    setFetchSuggestion(true); // Trigger the hook to fetch
  };

  // Handle account resolution on blur
  const handleResolveAccount = async () => {
    if (
      formData.accountNumber.length !== 10 ||
      !formData.bankCode ||
      isResolvingAccount
    ) {
      return;
    }

    setIsResolvingAccount(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "https://betapadi.onrender.com"
        }/api/banks/resolve-account?account_number=${
          formData.accountNumber
        }&bank_code=${formData.bankCode}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve account");
      }

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        accountName: data.data.account_name,
      }));
      setFormErrors((prev) => ({ ...prev, accountNumber: "" }));
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        accountNumber: "Invalid account number or bank code",
      }));
      setFormData((prev) => ({ ...prev, accountName: "" }));
    } finally {
      setIsResolvingAccount(false);
    }
  };

  // Check if latitude and longitude are valid numbers
  const isValidCoordinate = (coord) =>
    typeof coord === "number" && !isNaN(coord);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Business name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.openingTime)
      newErrors.openingTime = "Opening time is required";
    if (!formData.closingTime)
      newErrors.closingTime = "Closing time is required";
    if (!formData.deliveryOptions[0])
      newErrors.deliveryOptions = "Delivery option is required";
    if (!formData.businessType)
      newErrors.businessType = "Business group is required";
    if (
      !isValidCoordinate(formData.latitude) ||
      !isValidCoordinate(formData.longitude)
    ) {
      newErrors.address =
        "Please select a valid address from the dropdown to set coordinates";
    }
    if (formData.accountNumber && formData.accountNumber.length !== 10) {
      newErrors.accountNumber = "Account number must be 10 digits";
    }
    if (formData.accountNumber && !formData.bankCode) {
      newErrors.bankName = "Please select a bank";
    }
    if (formData.accountNumber && !formData.accountName) {
      newErrors.accountNumber = "Please resolve account name";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      addressInputRef.current?.focus();
      return;
    }

    try {
      await onFinish({
        ...formData,
        openingTime: formData.openingTime
          ? `${formData.openingTime}:00`
          : undefined,
        closingTime: formData.closingTime
          ? `${formData.closingTime}:00`
          : undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
        businessDays: formData.businessDays || undefined,
        accountNumber: formData.accountNumber || undefined,
        bankName: formData.bankName || undefined,
        bankCode: formData.bankCode || undefined,
        accountName: formData.accountName || undefined,
      });
      onCancel(); // Close modal on success
    } catch (err) {
      setError(err.message || "Failed to create business");
    }
  };

  return (
    <Modal
      title="Add New Business"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={window.innerWidth < 768 ? "95%" : 800}
    >
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Business Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none ${
                formErrors.name ? "border-red-500" : ""
              }`}
              placeholder="e.g. Ola Mummy"
              required
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="businessType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Business Group*
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none appearance-none bg-white ${
                formErrors.businessType ? "border-red-500" : ""
              }`}
              disabled={loading}
              required
            >
              <option value="">Select business group</option>
              {businessTypes.map((group) => (
                <option key={group.name} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
            {formErrors.businessType && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.businessType}
              </p>
            )}
            {loading && (
              <p className="text-gray-500 text-xs mt-1">
                Loading business groups...
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description*
              </label>
              <button
                type="button"
                onClick={handleDescriptionSuggestion}
                disabled={suggestionLoading || !formData.businessType}
                className={`px-3 py-1 text-sm rounded font-medium transition-colors ${
                  suggestionLoading || !formData.businessType
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {suggestionLoading ? "Loading..." : "Suggest"}
              </button>
            </div>
            {suggestionError && (
              <p className="text-red-500 text-xs mb-2">{suggestionError}</p>
            )}
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none resize-none ${
                formErrors.description ? "border-red-500" : ""
              }`}
              placeholder="Brief description of your business"
              required
            />
            {formErrors.description && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Number*
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none ${
                formErrors.contactNumber ? "border-red-500" : ""
              }`}
              placeholder="e.g. 08145380866"
              required
            />
            {formErrors.contactNumber && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.contactNumber}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              placeholder="e.g. https://example.com"
            />
          </div>

          <div className="space-y-2 relative" ref={addressInputRef}>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address*
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={`w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none ${
                formErrors.address ? "border-red-500" : ""
              }`}
              placeholder="e.g. 123 Main Street"
              required
            />
            {(addressLoading || debouncing) && showSuggestions && (
              <div className="absolute right-3 top-10 text-gray-500 flex items-center">
                {debouncing && !addressLoading && (
                  <span className="text-xs text-gray-400 mr-2">Typing...</span>
                )}
                {addressLoading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-500"></div>
                )}
              </div>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.place_id}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${
                      index === activeSuggestionIndex ? "bg-gray-100" : ""
                    }`}
                  >
                    {suggestion.description}
                    {!suggestion.details && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Details unavailable)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {(formErrors.address || addressError) && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.address || addressError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City*
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none ${
                formErrors.city ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.city && (
              <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State*
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none ${
                formErrors.state ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.state && (
              <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="localGovernment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Local Government
            </label>
            <input
              type="text"
              id="localGovernment"
              name="localGovernment"
              value={formData.localGovernment}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              placeholder="Local Government Area"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="openingTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Opening Time*
            </label>
            <input
              type="time"
              id="openingTime"
              name="openingTime"
              value={formData.openingTime}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none ${
                formErrors.openingTime ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.openingTime && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.openingTime}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="closingTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Closing Time*
            </label>
            <input
              type="time"
              id="closingTime"
              name="closingTime"
              value={formData.closingTime}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none ${
                formErrors.closingTime ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.closingTime && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.closingTime}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="businessDays"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Business Days
            </label>
            <input
              type="text"
              id="businessDays"
              name="businessDays"
              value={formData.businessDays}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              placeholder="e.g. Mon - Fri"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="deliveryOptions"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Delivery Options*
            </label>
            <select
              id="deliveryOptions"
              name="deliveryOptions"
              value={formData.deliveryOptions[0] || ""}
              onChange={handleDeliveryOptionsChange}
              className={`w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none appearance-none bg-white ${
                formErrors.deliveryOptions ? "border-red-500" : ""
              }`}
              required
            >
              <option value="">Select Delivery Option</option>
              <option value="In-house">In-house</option>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
            {formErrors.deliveryOptions && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.deliveryOptions}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="bankName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bank Name
            </label>
            <Select
              id="bankName"
              value={formData.bankName || undefined}
              onChange={handleBankChange}
              disabled={isFetchingBanks || loading}
              showSearch
              placeholder="Search and select a bank"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              className={`w-full ${
                formErrors.bankName ? "border-red-500" : ""
              }`}
              suffixIcon={
                isFetchingBanks ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-500"></div>
                ) : null
              }
            >
              {banks.map((bank) => (
                <Option key={bank.code} value={bank.name}>
                  {bank.name}
                </Option>
              ))}
            </Select>
            {formErrors.bankName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.bankName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Account Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                onBlur={handleResolveAccount}
                className={`w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none ${
                  formErrors.accountNumber ? "border-red-500" : ""
                }`}
                placeholder="e.g. 1234567890"
              />
              {isResolvingAccount && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
            {formErrors.accountNumber && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.accountNumber}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="accountName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Account Name
            </label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              value={formData.accountName}
              readOnly
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              placeholder="Account name will appear here"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="isActive"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Display latitude and longitude if set and valid */}
        {isValidCoordinate(formData.latitude) &&
          isValidCoordinate(formData.longitude) && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-700">
              <p>
                <span className="font-medium">Selected Coordinates:</span>{" "}
                Latitude: {formData.latitude.toFixed(6)}, Longitude:{" "}
                {formData.longitude.toFixed(6)}
              </p>
            </div>
          )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || isResolvingAccount}
            className={`px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition-colors ${
              loading || isResolvingAccount
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading ? "Creating..." : "Create Business"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

AddBusinessModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};
