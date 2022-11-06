export const defaultRecognitionSettings = {
    // detectInterval: 50, // 20fps
    confirmTime: 2000,
    confidence: 7.5,
    maxHands: 2,
}

class RecognitionSettings {
    constructor(key) {
        this.key = key;
    }

    getSettings() {
        return JSON.parse(localStorage.getItem(this.key)) || defaultRecognitionSettings;
    }

    setSettings(settings) {
        localStorage.setItem(this.key, JSON.stringify(settings));
    }

    removeSettings() {
        localStorage.removeItem(this.key);
    }

    getSettingByKey(key) {
        const settings = this.getSettings();

        return settings[key];
    }

    updateSetting(field, value) {
        const settings = this.getSettings();

        if (field) {
            this.setSettings({
                ...settings,
                [field]: value,
            });
        }
    }
}

const recognitionSettings = new RecognitionSettings('recognition_settings');

export default recognitionSettings;
