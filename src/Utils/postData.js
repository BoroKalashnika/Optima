const postData = async (url, json, setLoading) => {
    try {
        setLoading(true);
        const response = await fetch(url, {
            method: 'POST',
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
        return { status: null, data: 'Error en la conexión' };
    }finally {
        setLoading(false);
    }
};

export default postData;

