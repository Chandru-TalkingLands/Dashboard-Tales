import React from "react";
import { ToastContainer, Toast } from "react-toastify";

function ToastMsg() {
    return (
        <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover/>
    );
}

export default ToastMsg