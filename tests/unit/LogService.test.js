import LogService from '../../src/LogService';

describe('LogService', () => {
    let logger, consoleSpy;
    let originConsole = window.console;

    beforeEach(() => {
        logger = new LogService();
        logger.enable();

        consoleSpy = jasmine.createSpyObj('console', ['log', 'info', 'warn', 'error']);
        window.console = consoleSpy;
    });

    afterEach(() => {
        window.console = originConsole;
    });

    it('should be disabled by default', () => {
        expect((new LogService()).enabled).toBeFalsy();
    });

    it('should change its debug state', () => {
        expect(logger.enabled).toBeTruthy();

        logger.disable();

        expect(logger.enabled).toBeFalsy();

        logger.enable();

        expect(logger.enabled).toBeTruthy();
    });

    it('should not log if it is disabled', () => {
        logger.disable();
        logger.log('log.text');

        expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('should debug', () => {
        logger.log('log.text');
        expect(consoleSpy.log).toHaveBeenCalledWith(jasmine.stringMatching('log.text'));

        logger.info('info.text');
        expect(consoleSpy.info).toHaveBeenCalledWith(jasmine.stringMatching('info.text'));

        logger.warn('warn.text');
        expect(consoleSpy.warn).toHaveBeenCalledWith(jasmine.stringMatching('warn.text'));

        logger.error('error.text');
        expect(consoleSpy.error).toHaveBeenCalledWith(jasmine.stringMatching('error.text'));
    });
});

