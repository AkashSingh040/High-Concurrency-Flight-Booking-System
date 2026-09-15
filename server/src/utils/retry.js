const sleep = (ms) => {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
};


const retry = async (
    operation,
    maxAttempts = 3,
    baseDelay = 1000
) => {

    let attempt = 1;

    while (attempt <= maxAttempts) {

        try {

            return await operation();

        } catch (error) {

            if (attempt === maxAttempts) {
                throw error;
            }

            const delay =
                baseDelay *
                Math.pow(
                    2,
                    attempt - 1
                );

            console.log(
                `Attempt ${attempt} failed. ` +
                `Retrying in ${delay}ms...`
            );

            await sleep(delay);

            attempt++;
        }
    }
};


module.exports = {
    retry
};