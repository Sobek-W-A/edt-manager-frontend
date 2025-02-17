export default function TuileAffectation({ data }) {
    // Extraction des données
    const { profile, hours, date } = data;
    const formattedTime = new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="border border-green-500 rounded-lg p-3 flex justify-between items-center w-full">
            <span className="font-semibold">{profile.firstname} {profile.lastname}</span>
            <span className="text-gray-700">{hours}h</span>
            <span className="text-gray-500">{formattedTime}</span>
        </div>
    );
}