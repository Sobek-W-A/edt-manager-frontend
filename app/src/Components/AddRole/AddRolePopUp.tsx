interface AddRolePopUpProps {
    message: string;
    color: string;
}

const AddRolePopUp = ({ message, color }: AddRolePopUpProps) => {
    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg bg-${color}-500 text-white`}>
            {message}
        </div>
    )
}

export default AddRolePopUp;