interface AddRolePopUpProps {
    message: string;
    type: string;
}

const AddRolePopUp = ({ message, type }: AddRolePopUpProps) => {
    const svg = type === 'alert-success' ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";

    return (
        <div role="alert" className={`fixed top-4 right-4 p-4 w-fit alert ${type}`}>
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={svg} />
            </svg>
            <span>{message}</span>
        </div>
   )
}

export default AddRolePopUp;