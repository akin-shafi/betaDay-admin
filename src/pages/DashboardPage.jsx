import { useSession } from "../hooks/useSession";
import { Tabs } from "antd";
import { SingleUploadPage } from "./SingleUploadPage";
import { BulkUploadPage } from "./BulkUploadPage";

const { TabPane } = Tabs;

export function DashboardPage() {
  const { session } = useSession();
  console.log("session", session);
  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center flex-grow p-8">
      {/* Container for Tabs, center it using flex */}
      <div className="flex justify-center items-center w-full">
        <Tabs
          defaultActiveKey="1"
          type="card"
          className="w-full " // 100% on small screens, 50% on larger screens
        >
          <TabPane tab="Single Upload" key="1">
            <SingleUploadPage />
          </TabPane>
          <TabPane tab="Bulk Upload" key="2">
            <BulkUploadPage />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
