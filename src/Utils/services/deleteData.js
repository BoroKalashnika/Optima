const deleteData = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            console.log('Failed to delete data', response.status);
        }
    } catch (error) {
        console.log('Error:', error);
    }
};

export default deleteData;
