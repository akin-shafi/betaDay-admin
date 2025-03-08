import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/hooks/useAuth"; // Adjust path as necessary
import { Form, Select, Input, Row, Col } from "antd";

// import { fetchInstitution } from "@/hooks/useAction";
import WhiteLogo from "@/components/whiteLogo";

export function SignupPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        title: values.title,
        fullname: values.fullname,
        tags: values.tags,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        role: "data-entry",
        createdBy: "user",
      });
      if (response.statusCode === 200) {
        setError(response.message);
        navigate("/auth/login");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(`An error occurred while registering: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-whitesmoke text-white p-4">
      <div className="bg-white text-black rounded-lg shadow-lg p-8 max-w-lg w-full">
        <div className="flex justify-center items-center">
          <div className="mb-4 w-32 bg-gray-900 py-4 px-4 text-center rounded-md">
            <div className="text-center ">
              <WhiteLogo />
            </div>
          </div>
        </div>
        <div className="mb-4 text-1xl font-bold text-gray-600 text-center">
          Create an Account
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ tags: [] }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  { required: true, message: "Please select your title" },
                ]}
              >
                <Select placeholder="Select Title">
                  <Select.Option value="Mr">Mr</Select.Option>
                  <Select.Option value="Mrs">Mrs</Select.Option>
                  <Select.Option value="Ms">Ms</Select.Option>
                  <Select.Option value="Dr">Dr</Select.Option>
                  <Select.Option value="Prof">Prof</Select.Option>
                  <Select.Option value="Engr">Engr</Select.Option>
                  <Select.Option value="Barr">Barr</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={18}>
              <Form.Item
                name="fullname"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter the full name" },
                ]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
          </Row>

          {/* <Row gutter={16}>
            
          </Row> */}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter a valid email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                  {
                    type: "text",
                    message: "Please enter your phone number",
                  },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter a password" }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[
                  { required: true, message: "Please confirm your password" },
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>
            </Col>
          </Row>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gray-900 text-white py-2 rounded-md hover:bg-[#ff6600] mt-4 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Create Account"}
          </button>
        </Form>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <Link to="/auth/login" className="text-[#ff6600] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
