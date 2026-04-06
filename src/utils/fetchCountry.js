export const fetchCountryCodeFromIP = async () => {
    try {
        const saved = localStorage.getItem("user_country_code");
        if (saved) {
            console.log(saved, "from localStorage ✅");
            return saved;
        }
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        console.log(countryCode, "from API 🌍");
        console.log(data, " datafrom API 🌍");
        const countryCode = data?.country_code || "";
        localStorage.setItem("user_country_code", countryCode);
        return countryCode;
    } catch (err) {
        console.error("Error fetching country:", err);
        return "IN";
    }
};