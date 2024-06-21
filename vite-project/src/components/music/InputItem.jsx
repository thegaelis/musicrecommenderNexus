import PropTypes from "prop-types";

const InputItem = (props) => {
    return (
        <props.tag
            className="text-gray-700 cursor-pointer hover:text-hover font-normal"
            onClick={() => {
                props.onClick(props.data, props.type);
            }}
        >
            {props.data + ", "}
        </props.tag>
    );
};

InputItem.propTypes = {
    data: PropTypes.string,
    type: PropTypes.string,
    onClick: PropTypes.func,
};

export default InputItem;
