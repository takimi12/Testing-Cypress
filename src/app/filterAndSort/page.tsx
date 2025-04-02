
import styles from "./FilmyEbooki.module.scss";

import { getTopics } from "../../../helpers/api/getTopic";
import { getCategories } from "../../../helpers/api/getCategory";
import MainPage from "./components/MainPage";

 const FilmyEbooki = async () => {
	const topicsResponse = await getTopics();
	
	const categoriesResponse = await getCategories();
  
	const { topics = [] } = topicsResponse || {};
	const { categories = [] } = categoriesResponse || {};


	return (
		<>
			<div className={`Container ${styles.Container}`}>
				<MainPage categories={categories} topics={topics} />
			</div>
		</>
	);
};

export default FilmyEbooki