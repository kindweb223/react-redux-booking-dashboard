import React from "react";
import ReactModal from "react-modal";
import SvgButton from "../buttons/SvgButton";
import close from "../../images/ui/close.svg";
import colors from "../style/Colors";

const Modal = props => {
  const { width = null, onClose, children } = props;

  const style = {
    overlay: {
      backgroundColor: colors.ultra_dark + "60",
      zIndex: 1000
    },
    content: {
      left: 0,
      right: 0,
      padding: 0,
      overflow: "visible",
      top: "3em",
      width: width || "56em",
      maxWidth: "90%",
      bottom: "3em",
      margin: "0 auto",
      border: "none",
      background: "transparent"
    }
  };

  return (
    <ReactModal style={style} {...props}>
      <SvgButton
        svg={close}
        width={22}
        height={22}
        style={{
          position: "absolute",
          right: -11,
          top: -11,
          zIndex: 999
        }}
        onClick={onClose}
      />
      {children}
    </ReactModal>
  );
};

export default Modal;
