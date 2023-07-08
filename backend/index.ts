const expressApp = require('./app');
const logger = require('./src/utils/logger');
const config = require('./src/utils/config');

expressApp.listen(config.PORT, () => {
    logger.info(`Server is running on port ${config.PORT}`)
})