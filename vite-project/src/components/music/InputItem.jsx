import PropTypes from "prop-types";

const InputItem = (props) => {
    return (
        <div
            className="text-gray-700 cursor-pointer hover:text-hover"
            onClick={() => {
                props.onClick(props.data, props.type);
            }}
        >
            {props.data}
        </div>
    );
};

InputItem.propTypes = {
    data: PropTypes.string,
    type: PropTypes.string,
    onClick: PropTypes.func,
};

export default InputItem;
