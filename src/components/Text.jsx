const Text = ({ text, type, className }) => {
    if (type === "h1") {
        return (
            <h1 className={className}>{text}</h1>
        )
    } else if (type === "p") {
        return (
            <p className={className}>{text}</p>
        )
    } else {
        return (
            <p>{text}</p>
        )
    }
}

export default Text;