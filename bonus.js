export const longestCommonPrefix = (strings) => {
    if (!Array.isArray(strings) || strings.length === 0) {
        return "";
    }

    let prefix = strings[0];
    for (const value of strings.slice(1)) {
        while (!value.startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
            if (prefix === "") {
                return "";
            }
        }
    }

    return prefix;
};

export default longestCommonPrefix;
