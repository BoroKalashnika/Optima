const deleteData = async (url, setLoading) => {
    try {
        setLoading(true);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });

        const status = response.status;
        const data = await response.json();
        
        return { status, data: data };

    } catch (error) {
        console.error('Error en la petición post:', error);
        return { status: null, data: { message: 'Error en la conexión' } };
    } finally {
        deleteData(false);
    }
};

export default deleteData;
