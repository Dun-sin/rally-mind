const app1 = require('./app');
const logger1 = require('./utils/logger');
const config1 = require('./utils/config');

app1.listen(config1.PORT, () => {
	logger1.info(`Server is running on port ${config1.PORT}`);
});
