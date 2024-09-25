export const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
};

export const formatUnixTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000); // แปลง Unix timestamp เป็นมิลลิวินาที
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleString('th-TH', options);
};