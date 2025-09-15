import PrivateImg from '../assets/Private.png';
import { useTranslation } from 'react-i18next';

const Private = ({text}) => {
    const { i18n,t } = useTranslation();
    return (
        <div className="flex self-center flex-col w-full justify-center items-center">
            <img className="rounded-lg" src={PrivateImg} width="300px" alt={t('privateresource')} />
            { text ? <p className="font-semibold text-2xl mt-4">{text}</p> : null }
        </div>
    )
}

export default Private;