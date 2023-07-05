import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { colorSecondary } from '../../constants/colors';
import styles from './ScrollUpButton.module.scss';

const ScrollUpButton = (): JSX.Element => {
	const [scrollHeight, setScrollHeight] = useState<number>(0); // высота прокрутки в пикселях

	// подписываемся на событие прокрутки
	useEffect(() => {
		window.addEventListener("scroll", setScrollFunc);
		// отписываемся от события прокрутки
		return () => window.removeEventListener("scroll", setScrollFunc);
	}, []);

	// функция установки в state высоты прокрутки
	const setScrollFunc = (): void => {
		setScrollHeight(window.scrollY);
	};

	// плавный скролл до верха страницы
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
	};

	return (
		<>
			{scrollHeight > 300 &&
				<div className={styles.arrowUp} onClick={scrollToTop}>
					<FontAwesomeIcon icon={faChevronUp} size='xl' color={colorSecondary} />
				</div>
			}
		</>
	);
};

export default ScrollUpButton;
