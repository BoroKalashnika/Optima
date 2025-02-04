const postData = async (url, json) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });

        const status = response.status;
        return { status };

    } catch (error) {
        console.error('Error en la petición post:', error);
        return { status: null, message: 'Error en la conexión' };
    }
};

export default postData;

