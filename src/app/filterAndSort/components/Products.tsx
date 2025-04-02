import styles from "./Products.module.scss";
import Link from "next/link";
import Image from "next/image";
import { IProduct } from "../../../../backend/models/product"; 

interface TopicsListProps {
	topics: IProduct[]; 
}

export default function Products({ topics }: TopicsListProps) {
  if (!topics || topics.length === 0) {
    return <div>Brak dostępnych produktów</div>;
  }
  return (
    <>
      {topics.map((product) => (
        <div
        data-test-id={product.price}
        key={product._id} className={`${styles.singleProduct}`}>
          <span className={`${styles.availableTop}`}>Produkty dostępny</span>
          <div className={`${styles.productPhoto}`}>
            <Image src={product.imageFileUrl} alt="product" width={300} height={300} />
          </div>
          <div className={`${styles.textWraper} `}>
            <div className={`${styles.cardTitle}`}>
              <Link href="">
                <h4 
                data-test-id="title"
                className={styles.anchor}>{product.title}</h4>
              </Link>
              <span 
              data-test-id="category"
              className={`${styles.underLink}`}>{product.subtitle}</span>
            </div>
            <p className={`${styles.mainText}`}>{product.description}</p>
       
            <div className={`${styles.circle}`}></div>
            <div className={`${styles.priceParent} `}>
              <p className={`${styles.amount} `}>{product.price} zł</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}