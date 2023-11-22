import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import Spinner from './Spinner';

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [category, setCategory] = useState(existingCategory || null);
  const [productProperties, setProductProperties] = useState(
    existingProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || '');
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then((result) => setCategories(result.data));
  }, []);

  async function saveProduct(event) {
    event.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };

    if (_id) {
      //? update
      await axios.put('/api/products', { ...data, _id });
    } else {
      //? create
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push('/products');
  }

  async function uploadImages(event) {
    const files = event.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  //? Drag&Drop order
  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProperty(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Nom du produit</label>
      <input
        type='text'
        placeholder='product name'
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <label>Categorie</label>
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value=''>Pas de catégorie</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option value={category._id}>{category.name}</option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div className='' key={p.name}>
            <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
            <div>
            <select
              value={productProperties[p.name]}
              onChange={(event) =>
                setProductProperty(p.name, event.target.value)
              }
            >
              {p.values.map((value) => (
                <option value={value}>{value}</option>
              ))}
            </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className='mb-2 flex flex-wrap gap-2'>
        <ReactSortable
          className='flex flex-wrap gap-1'
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className='bg-white p-3 shadow-sm rounded-sm border border-gray-200 h-24'>
                <img src={link} alt='' className='rounded-lg' />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className='h-24 flex items-center'>
            <Spinner />
          </div>
        )}
        <label className=' flex flex-col h-24 w-24 cursor-pointer items-center justify-center gap-1 border border-primary rounded-sm bg-white shadow-sm text-center text-sm text-primary'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-6 w-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
            />
          </svg>
          <div>Ajouter des images</div>
          <input type='file' onChange={uploadImages} className='hidden' />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder='description'
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      ></textarea>
      <label>Prix (€)</label>
      <input
        type='number'
        placeholder='price'
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
      <button type='submit' className='btn-primary'>
        Enregistrer
      </button>
    </form>
  );
}
