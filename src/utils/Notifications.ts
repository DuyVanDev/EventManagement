import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const Alertwarning = (title : string) => {
    toast.warning(title + " 😔", {
        theme: "colored",
        autoClose: 2500,
    });
};

export const Alertsuccess = (title = "", type = 0) => {
    if (type === 0) {
        toast.success(title, {
            theme: "colored",
            autoClose: 2500,
        });
    } 
    else if (type === 1) {
        toast.success(title, {
            theme: "colored",
            autoClose: 2500,
        });
    }
    else {
        toast.success(title + " 😍", {
            theme: "colored",
            autoClose: 2500,
        });
    }
};

export const Alertinfo = (title) => {
    toast.info(title + " 🥰", {
        theme: "colored",
        autoClose: 2500,
    });
};

export const Alerterror = (title) => {
    toast.error(title + " 🤬", {
        theme: "colored",
        autoClose: 2500,
    });
};

export const AlertwarningMobile = (title) => {
    toast.warning(title + " 😔", {
        theme: "colored",
        autoClose: 2500,
    });
};

export const AlertsuccessMobile = (title) => {
    toast.success(title + " 😍", {
        theme: "colored",
        autoClose: 2500,
    });
};
