/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import { useFetchBusinessGroups } from "@/hooks/useBusiness";
import { useSession } from "@/hooks/useSession";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";
import { useDescriptionSuggestion } from "@/hooks/useDescriptionSuggestion";

export default function EditBusinessModal({ isVisible, onCancel, onFinish, business }) {
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState(null);
  const { session } = useSession();
  const addressInputRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [error, setError] = useState(null);

  // Form state initialized with business data
  const [formData, setFormData] = useState({
    name: business?.name || "",
    description: business?.description || "",
    contactNumber: business?.contactNumber || "",
    website: business?.website || "",
    address: business?.address || "",
    city: business?.city || "",
    state: business?.state || "",
    localGovernment: business?.localGovernment || "",
    latitude: business?.latitude !== undefined ? Number(business.latitude) : null,
    longitude: business?.longitude !== undefined ? Number(business.longitude) : null,
    openingTime: business?.openingTime ? business.openingTime.slice(0, 5) : "08:00",
    closingTime: business?.closingTime ? business.closingTime.slice(0, 5) : "18:00",
    businessDays: business?.businessDays || "",
    deliveryOptions: business?.deliveryOptions || ["In-house"],
    businessType: business?.businessType || "",
    accountNumber: business?.accountNumber || "",
    bankName: business?.bankName || "",
    accountName: business?.accountName || "",
    isActive: business?.isActive ?? true,
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

  // Use description suggestion hook
  const [fetchSuggestion, setFetchSuggestion] = useState(false);
  const { suggestedDescription, isLoading: suggestionLoading } = useDescriptionSuggestion({
    businessType: formData.businessType,
    businessName: formData.name,
  });

  // Fetch business groups when modal is opened
  const {
    groups: fetchedGroups,
    loading: groupsLoading,
    error: groupsError,
  } = useFetchBusinessGroups(session?.token, isVisible);

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

  // Update formData when business prop changes
  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || "",
        description: business.description || "",
        contactNumber: business.contactNumber || "",
        website: business.website || "",
        address: business.address || "",
        city: business.city || "",
        state: business.state || "",
        localGovernment: business.localGovernment || "",
        latitude: business.latitude !== undefined ? Number(business.latitude) : null,
        longitude: business.longitude !== undefined ? Number(business.longitude) : null,
        openingTime: business.openingTime ? business.openingTime.slice(0, 5) : "08:00",
        closingTime: business.closingTime ? business.closingTime.slice(0, 5) : "18:00",
        businessDays: business.businessDays || "",
        deliveryOptions: business.deliveryOptions || ["In-house"],
        businessType: business.businessType || "",
        accountNumber: business.accountNumber || "",
        bankName: business.bankName || "",
        accountName: business.accountName || "",
        isActive: business.isActive ?? true,
      });
      setAddressInput(business.address || "");
    }
  }, [business, setAddressInput]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply suggested description
  useEffect(() => {
    if (fetchSuggestion && suggestedDescription && !suggestionLoading) {
      setFormData((prev) => ({ ...prev, description: suggestedDescription }));
      setFetchSuggestion(false);
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
  };

  // Handle delivery options
  const handleDeliveryOptionsChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      deliveryOptions: [value],
    }));
  };

  // Handle address suggestion
  const handleSuggestionSelect = (suggestion) => {
    console.log("Suggestion Details:", suggestion.details);
    const formatLocalGovernment = (localGov) => {
      if (!localGov) return "";
      return localGov.replace(/\/|\s+/g, "-");
    };
    setFormData((prev) => ({
      ...prev,
      address: suggestion.description,
      city: formatLocalGovernment(suggestion.details?.localGovernment) || "",
      state: suggestion.details?.state || "",
      localGovernment: formatLocalGovernment(suggestion.details?.localGovernment) || "",
      latitude: suggestion.details?.latitude !== undefined ? Number(suggestion.details.latitude) : null,
      longitude: suggestion.details?.longitude !== undefined ? Number(suggestion.details.longitude) : null,
    }));
    setAddressInput(suggestion.description);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
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

  // Handle description suggestion
  const handleDescriptionSuggestion = () => {
    if (!formData.businessType) {
      setSuggestionError("Please select a business group");
      return;
    }
    setSuggestionError(null);
    setFetchSuggestion(true);
  };

  // Validate coordinates
  const isValidCoordinate = (coord) => typeof coord === 'number' && !isNaN(coord);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.contactNumber ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.openingTime ||
      !formData.closingTime ||
      !formData.deliveryOptions[0] ||
      !formData.businessType
    ) {
      setError("Please fill in all required fields.");
      addressInputRef.current?.focus();
      return;
    }

    // Validate coordinates
    if (!isValidCoordinate(formData.latitude) || !isValidCoordinate(formData.longitude)) {
      setError("Please select a valid address from the dropdown to set coordinates.");
      addressInputRef.current?.focus();
      return;
    }

    try {
      await onFinish({
        ...formData,
        openingTime: formData.openingTime ? `${formData.openingTime}:00` : null,
        closingTime: formData.closingTime ? `${formData.closingTime}:00` : null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        businessDays: formData.businessDays || null,
        accountNumber: formData.accountNumber || null,
        bankName: formData.bankName || null,
        accountName: formData.accountName || null,
      });
      onCancel();
    } catch (err) {
      setError(err.message || "Failed to update business");
    }
  };

  return (
    <Modal
      title="Edit Business"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. Ola Mummy"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
              Business Group*
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white"
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
            {loading && <p className="text-gray-500 text-xs mt-1">Loading business groups...</p>}
          </div>

          <div className="space-y-2 col-span-2">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
            {suggestionError && <p className="text-red-500 text-xs mb-2">{suggestionError}</p>}
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
              placeholder="Brief description of your business"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number*
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. 08145380866"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. https://example.com"
            />
          </div>

          <div className="space-y-2 relative" ref={addressInputRef}>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address*
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. 123 Main Street"
              required
            />
            {(addressLoading || debouncing) && showSuggestions && (
              <div className="absolute right-3 top-10 text-gray-500 flex items-center">
                {debouncing && !addressLoading && (
                  <span className="text-xs text-gray-400 mr-2">Typing...</span>
                )}
                {addressLoading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#FF6B00]"></div>
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
                      <span className="text-xs text-gray-500 ml-2">(Details unavailable)</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {addressError && <p className="text-red-500 text-xs mt-1">{addressError}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City*
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State*
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="localGovernment" className="block text-sm font-medium text-gray-700 mb-1">
              Local Government
            </label>
            <input
              type="text"
              id="localGovernment"
              name="localGovernment"
              value={formData.localGovernment}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Local Government Area"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="openingTime" className="block text-sm font-medium text-gray-700 mb-1">
              Opening Time*
            </label>
            <input
              type="time"
              id="openingTime"
              name="openingTime"
              value={formData.openingTime}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="closingTime" className="block text-sm font-medium text-gray-700 mb-1">
              Closing Time*
            </label>
            <input
              type="time"
              id="closingTime"
              name="closingTime"
              value={formData.closingTime}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="businessDays" className="block text-sm font-medium text-gray-700 mb-1">
              Business Days
            </label>
            <input
              type="text"
              id="businessDays"
              name="businessDays"
              value={formData.businessDays}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. Mon - Fri"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="deliveryOptions" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Options*
            </label>
            <select
              id="deliveryOptions"
              name="deliveryOptions"
              value={formData.deliveryOptions[0] || ""}
              onChange={handleDeliveryOptionsChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none bg-white"
              required
            >
              <option value="">Select Delivery Option</option>
              <option value="In-house">In-house</option>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. 1234567890"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. First Bank"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
              Account Name
            </label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              value={formData.accountName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. John Doe Enterprises"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-[#FF6B00] border-gray-300 rounded focus:ring-[#FF6B00]/20"
            />
            <span className="ml-2 text-sm text-gray-700">
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Display latitude and longitude if set and valid */}
        {isValidCoordinate(formData.latitude) && isValidCoordinate(formData.longitude) && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-700">
            <p>
              <span className="font-medium">Selected Coordinates:</span>{" "}
              Latitude: {formData.latitude.toFixed(6)}, Longitude: {formData.longitude.toFixed(6)}
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
            disabled={loading}
            className={`px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Business"}
          </button>
        </div>
      </form>
    </Modal>
  );
}