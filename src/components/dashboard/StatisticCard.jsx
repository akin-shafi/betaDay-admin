/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import StatAvatar from "@/assets/stat-avatar.svg";

const StatisticsCard = ({ title, detail, trend, icon, bgColor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${bgColor} p-4 rounded-xl cursor-pointer hover:shadow-lg transition-all`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{detail}</h3>
          {trend && <p className="text-sm text-gray-500 mt-1">{trend}</p>}
        </div>
        {icon}
      </div>
    </div>
  );
};

StatisticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
  trend: PropTypes.string,
  icon: PropTypes.node,
  bgColor: PropTypes.string,
  onClick: PropTypes.func,
};

StatisticsCard.defaultProps = {
  bgColor: "bg-gray-50",
  trend: "",
  icon: null,
  onClick: () => {},
};

export default StatisticsCard;
