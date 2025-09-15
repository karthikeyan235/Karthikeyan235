import toast from 'react-hot-toast';

const showError = () => {
    toast(t('trypremium'), {
        icon: '⚠️'
    });
    return;
}

export { showError };