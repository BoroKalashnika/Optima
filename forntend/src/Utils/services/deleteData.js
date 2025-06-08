const deleteData = async (url, setLoading) => {
    try {
        setLoading(true);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const status = response.status;
        const data = await response.json();
        
        return { status, data: data };

    } catch (error) {
        return { status: null, data: { message: 'Error in the connection' } };
    } finally {
        setLoading(false);
    }
};

export default deleteData;
