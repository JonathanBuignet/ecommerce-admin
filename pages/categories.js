import Layout from '@/components/Layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(event) {
    event.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((property) => ({
        name: property.name,
        values: property.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('api/categories', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(','),
      }))
    );
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: 'Etes-vous sûr(e) ?',
        text: `Voulez-vous réellement supprimer ${category.name} ?`,
        showCancelButton: true,
        cancelButtonText: 'Annuler',
        confirmButtonText: 'Oui, supprimer !',
        confirmButtonColor: '#d55',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete('/api/categories?_id=' + _id);
          fetchCategories();
        }
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: '', values: '' }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((property, propertyIndex) => {
        return propertyIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Editer catégorie ${editedCategory.name}`
          : 'Créer une nouvelle categories'}
      </label>
      <form onSubmit={saveCategory}>
        <div className='flex gap-1'>
          <input
            type='text'
            placeholder={'Nom de catégorie'}
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
          <select
            onChange={(event) => setParentCategory(event.target.value)}
            value={parentCategory}
          >
            <option value=''>Aucune catégorie parent</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className='mb-2'>
          <label className='block'> Propriétés</label>
          <button
            type='button'
            onClick={addProperty}
            className='btn-default mb-2 text-sm'
          >
            Ajouter une propriété
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className='mb-2 flex gap-1'>
                <input
                  className='mb-0'
                  type='text'
                  key={property.id}
                  value={property.name}
                  onChange={(event) =>
                    handlePropertyNameChange(
                      index,
                      property,
                      event.target.value
                    )
                  }
                  placeholder='Nom de propriété (exemple: coleur)'
                />
                <input
                  className='mb-0'
                  type='text'
                  value={property.values}
                  onChange={(event) =>
                    handlePropertyValuesChange(
                      index,
                      property,
                      event.target.value
                    )
                  }
                  placeholder='valeurs, séparées par virgule'
                />
                <button
                  type='button'
                  onClick={() => removeProperty(index)}
                  className='btn-red'
                >
                  Supprimer
                </button>
              </div>
            ))}
        </div>
        <div className='flex gap-1'>
          {editedCategory && (
            <button
              type='button'
              onClick={() => {
                setEditedCategory(null),
                  setName(''),
                  setParentCategory(''),
                  setProperties([]);
              }}
              className='btn-default py-1'
            >
              Annuler
            </button>
          )}
          <button type='submit' className='btn-primary py-1'>
            Enregistrer
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className='basic mt-4'>
          <thead>
            <tr>
              <td>Nom Catégorie</td>
              <td>Catégorie Parent</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td className='flex'>
                    <button
                      onClick={() => editCategory(category)}
                      className='btn-default mr-1 flex items-center gap-1'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-4 w-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className='btn-red flex items-center gap-1'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-4 w-4'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                        />
                      </svg>
                      Suppr
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
