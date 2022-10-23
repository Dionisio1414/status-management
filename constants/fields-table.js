export const FIELDS_TABLE = [
  { key: 'selected', label: '', visible: true, isEditable: false },
  { key: 'skin', label: 'На скине', visible: true, isEditable: false },
  { key: 'article_id', label: 'Article ID', visible: true, isEditable: false },
  { key: 'brand_name', label: 'Brand Name', visible: false, isEditable: true },
  { key: 'article_no', label: 'Article №', visible: true, isEditable: false },
  { key: 'category_id', label: 'CategoryID', visible: true, isEditable: false },
  {
    key: 'category_name',
    label: 'CategoryName',
    visible: true,
    isEditable: true,
  },
  { key: 'main_oe', label: 'Основной ОЕ', visible: true, isEditable: false },
  { key: 'main_tn', label: 'Основной TN', visible: false, isEditable: true },
  { key: 'price_netto', label: 'Цена Нетто', visible: false, isEditable: true },
  { key: 'profit', label: 'Наценка %', visible: false, isEditable: true },
  { key: 'price', label: 'Цена', visible: true, isEditable: true },
  {
    key: 'label_unliquid',
    label: 'Метка "Неликвид"',
    visible: true,
    isEditable: true,
  },
  {
    key: 'original_product',
    label: 'Оригинал Продукт',
    visible: true,
    isEditable: true,
  },
  {
    key: 'product_price',
    label: 'Цена от продукта',
    visible: false,
    isEditable: true,
  },
  { key: 'label_abc', label: 'АВС - метка', visible: false, isEditable: true },
  {
    key: 'mark_rating',
    label: 'Марк-рейтинг',
    visible: false,
    isEditable: true,
  },
  { key: 'weight', label: 'Вес', visible: false, isEditable: true },
  { key: 'heavy_truck', label: 'Большегруз', visible: true, isEditable: false },
  { key: 'patented', label: 'Запатентован', visible: true, isEditable: false },
  { key: 'to_order', label: 'К заказу', visible: true, isEditable: false },
  {
    key: 'certification',
    label: 'Требует сертификации',
    visible: true,
    isEditable: false,
  },
  { key: 'in_stock', label: 'На складе', visible: false, isEditable: true },
  { key: 'in_reserve', label: 'В резерве', visible: false, isEditable: true },
];

export const FIELDS_CHARACTERISTICS_TABLE = [
  { key: 'id', label: 'ID хар-ки' },
  { key: 'name', label: 'Название' },
  { key: 'value', label: 'Значение' },
  { key: 'type', label: 'Тип' },
];

export const FIELDS_LOGS_TABLE = [
  { key: 'date', label: 'Date' },
  { key: 'user', label: 'User' },
  { key: 'show_details', label: '' },
];

export const FIELDS_CONFIRM_SETTINGS = [
  { key: 'spreadsheet_columns	', label: 'Spreadsheet columns	' },
  { key: 'column_handlers', label: 'Column handlers' },
];
