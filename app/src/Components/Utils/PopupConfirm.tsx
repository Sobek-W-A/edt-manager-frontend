
interface PopupConfirmProps {
    title: string,
    confirm: () => void,
    cancel: () => void
}

export default function ConfirmationPopup({title, confirm, cancel}: PopupConfirmProps) {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-5 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <div className="flex justify-end mt-4">
                    <button onClick={cancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Annuler
                    </button>
                    <button onClick={confirm} className="bg-green-500 text-white px-4 py-2 rounded">Confirmer
                    </button>
                </div>
            </div>
        </div>
    )
}