const getColorClass = (id) => {
    const colors = [
        {
            border: "border-blue-300",
            bg: "bg-blue-50",
            text: "text-blue-700",
            badge: "bg-blue-100 text-blue-700",
        },
        {
            border: "border-purple-300",
            bg: "bg-purple-50",
            text: "text-purple-700",
            badge: "bg-purple-100 text-purple-700",
        },
        {
            border: "border-green-300",
            bg: "bg-green-50",
            text: "text-green-700",
            badge: "bg-green-100 text-green-700",
        },
        {
            border: "border-orange-300",
            bg: "bg-orange-50",
            text: "text-orange-700",
            badge: "bg-orange-100 text-orange-700",
        },
        {
            border: "border-pink-300",
            bg: "bg-pink-50",
            text: "text-pink-700",
            badge: "bg-pink-100 text-pink-700",
        },
    ];
    const hash = String(id)
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};
export { getColorClass };