import styles from "./Category.module.scss";
import Link from "next/link";
import Image from "next/image";
import { replacePolishChars } from "../../../../helpers/replacePolishChart";
import { ICategory } from "../../../../backend/models/category"

interface CategoryListProps {
  categories: ICategory[]; 
}

const Category1 = ({ categories }: CategoryListProps) => {
  
  return (
    <>
      {categories.map((product: ICategory) => (
        <div 
        data-test-id="0"
        key={product._id} className={styles.singleProduct}>
          <span className={styles.availableTop}>FIZJOTERAPEUTA POLECA</span>
          <div className={styles.productPhoto}>
            <Image src={product.imageFileUrl} alt="product" width={300} height={300} />
          </div>
          <div className={`${styles.textWraper} `}>
            <div className={styles.cardTitle}>
              <Link className={styles.anchor} href="">
                <h4
                data-test-i="title"
                >{product.title}</h4>
              </Link>
              <span className={styles.underLink}>
                {product.subtitle1} • {product.subtitle2} • {product.subtitle3}
              </span>
            </div>
            <p className={styles.mainText}>{product.description}</p>
           
            <div className={`${styles.priceParent} `}>
              <Link
                href={`/filmy-i-ebooki/${replacePolishChars(product.category.replace(/\s+/g, "-"))}`}
              >
                <button>Zobacz szczegóły</button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Category1;