import Not_Found from '../assets/Not_Found.png';
import { useTranslation } from 'react-i18next';

const NotFound = ({info, text}) => {
    const { i18n,t } = useTranslation();
    return (
        <div className="flex flex-col w-full justify-center items-center">
            <img className="rounded-lg" src={Not_Found} width="250px" alt={t('noresourcefound')} />
            { info ? <p className="font-semibold leading-none text-center mt-2">{info}</p> : null }
            { text ? <p className="text-center mt-2">{text}</p> : null }
        </div>
    )
}

export default NotFound;