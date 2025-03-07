/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { useSession } from "@/hooks/useSession";
import { useParams } from "react-router-dom";
import { Table, Button, Popconfirm, message } from "antd";
import {
  fetchContactsByInstitutionId,
  deleteContactById,
  createContact,
  updateContact,
} from "@/hooks/useAction";
import ContactPersonModal from "@/components/modals/ContactPersonModal";

export function ContactPage() {
  const { session } = useSession();
  const token = session?.token;
  const fullname = session?.user?.fullname;
  const designatedBy = session?.user?.applicationNo;
  const { id } = useParams();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchData = useCallback(async () => {
    if (!token) {
      console.warn("No token available to fetch contacts.");
      return;
    }

    setLoading(true);
    try {
      const result = await fetchContactsByInstitutionId(id, token);
      setContacts(result);
      setFilteredContacts(result);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      message.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  const handleAddContact = () => {
    setSelectedContact(null);
    setModalVisible(true);
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  const handleDelete = async (contactId) => {
    setLoading(true);
    try {
      await deleteContactById(contactId, token); // Pass token
      message.success("Contact deleted successfully");
      setContacts(contacts.filter((contact) => contact.id !== contactId));
      setFilteredContacts(
        filteredContacts.filter((contact) => contact.id !== contactId)
      );
    } catch (error) {
      console.error("Failed to delete contact:", error);
      message.error("Failed to delete contact");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedContact(null);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    {
      title: "Full name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            onClick={() => handleView(record)}
            className="bg-appGreen text-white px-3 py-1 rounded hover:bg-gold"
          >
            View
          </Button>
          <Button
            onClick={() => handleEdit(record)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this contact?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              className="bg-red-500 text-red ml-1 px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="w-full h-[92vh] grid grid-rows-[10%_1fr] md:px-12 px-5 py-3">
        <div className="w-full h-[8%] flex justify-between md:gap-0 gap-4 mt-1">
          <div>
            <h5 className="md:text-[20px] text-[16px] font-medium text-black">
              Contact Persons
            </h5>
            <p className="text-[#667085] md:text-[14px] text-[12px] font-normal">
              Welcome {fullname}
            </p>
          </div>
        </div>

        <div className="w-full h-[95%] mt-3 bg-white rounded-[10px] border border-[#E4E7EC] flex flex-col gap-3 overflow-y-auto p-4 scroller-none">
          <div className="w-full h-[170px] rounded-[12px] flex items-center justify-between bg-olive p-4">
            <div className="md:basis-[50%] basis-full text-secondary h-full flex flex-col justify-center gap-2">
              <h6 className="text-[10px] font-bold">OVERVIEW</h6>
              <p className="md:text-[14px] text-[12px] font-light">
                View all contact persons associated with this institution.
              </p>
            </div>
            <div className="md:basis-[30%] basis-0 md:flex w-full h-full items-center justify-center">
              <button
                onClick={handleAddContact}
                className="py-[10px] px-[20px] bg-appGreen hover:bg-gold rounded-[100px] text-white"
              >
                Add Contact
              </button>
            </div>
          </div>

          <div className="p-4 shadow-md">
            <h5 className="md:text-[24px] text-[18px] text-black font-medium border-b">
              Contact Person List
            </h5>
            <Table
              columns={columns}
              dataSource={filteredContacts}
              loading={loading}
              className="custom-table"
              rowKey="id"
            />
          </div>
        </div>
      </div>

      <ContactPersonModal
        visible={modalVisible}
        mode={selectedContact ? "edit" : "create"}
        onClose={handleModalClose}
        onSave={(contactData) => {
          const saveContact = selectedContact
            ? () => updateContact(selectedContact.id, contactData, token) // Fix: pass id, data, and token
            : () => createContact(contactData, token);

          saveContact()
            .then(() => {
              message.success(
                selectedContact
                  ? "Contact updated successfully"
                  : "Contact added successfully"
              );
              handleModalClose();
            })
            .catch((error) => {
              console.error("Failed to save contact:", error);
              message.error("Failed to save contact");
            });
        }}
        contact={selectedContact}
        designatedBy={designatedBy}
        institutionId={id}
      />
    </div>
  );
}
