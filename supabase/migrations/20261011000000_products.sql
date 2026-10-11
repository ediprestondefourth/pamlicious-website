create table if not exists public.products (
  id integer primary key,
  name text not null,
  category text not null check (category in ('Cakes', 'Croissants', 'Savory', 'Box Deals')),
  price integer not null check (price > 0),
  image text not null,
  hover_image text not null,
  badge text check (badge is null or badge in ('Best Seller', 'Gluten-Free', 'Limited Stock')),
  description text not null,
  stock integer not null default 0 check (stock >= 0),
  sku text not null unique,
  status text not null default 'Active' check (status in ('Active', 'Draft'))
);

alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant all on public.products to service_role;

insert into public.products (id, name, category, price, image, hover_image, badge, description, stock, sku, status) values
  (1, 'Strawberry Dream Cake', 'Cakes', 18500, 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1615796701805-2094ac54bbf9?w=600&h=600&fit=crop&auto=format', 'Best Seller', 'Layers of moist vanilla sponge, fresh strawberry compote, and whipped cream.', 12, 'CAK-001', 'Active'),
  (2, 'Classic Butter Croissant', 'Croissants', 2800, 'https://images.unsplash.com/photo-1534432182912-63863115e106?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&h=600&fit=crop&auto=format', 'Best Seller', 'Flaky, golden-brown pastry with rich European butter, baked to perfection.', 30, 'CRO-001', 'Active'),
  (3, 'Chocolate Velvet Cupcakes', 'Cakes', 7500, 'https://images.unsplash.com/photo-1595144780677-6d0b5abbd089?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1547398847-19d7560a6257?w=600&h=600&fit=crop&auto=format', 'Limited Stock', 'Rich dark chocolate cupcakes with silky ganache frosting. Box of 6.', 4, 'CAK-002', 'Active'),
  (4, 'Burger', 'Savory', 6000, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=600&fit=crop&auto=format', null, 'A juicy grilled burger stacked with cheddar, lettuce, tomato, and a soft toasted bun.', 25, 'SAV-003', 'Active'),
  (5, 'Nigeria-Made Meat Pie', 'Savory', 1500, 'https://images.unsplash.com/photo-1518492104633-130d0f2c5262?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=600&fit=crop&auto=format', null, 'A classic Nigerian handmade meat pie with flaky pastry and richly seasoned minced beef filling.', 30, 'SAV-004', 'Active'),
  (6, 'Fruit Parfait', 'Cakes', 5000, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&h=600&fit=crop&auto=format', null, 'Fresh fruit layers with creamy yogurt and a crunchy granola finish in a chilled cup.', 18, 'CAK-004', 'Active'),
  (7, 'Cake Parfait', 'Cakes', 5000, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1464306076886-da185f6a9d8e?w=600&h=600&fit=crop&auto=format', null, 'A soft, indulgent parfait layered with cake crumbles, cream, and a sweet finishing drizzle.', 20, 'CAK-005', 'Active'),
  (8, 'Small Chops Box Package', 'Box Deals', 5000, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&h=600&fit=crop&auto=format', 'Best Seller', 'An assorted small chops box packed with bite-sized savory favourites for parties and events.', 12, 'BOX-003', 'Active'),
  (9, 'Almond & Herb Cheese Roll', 'Savory', 4200, 'https://images.unsplash.com/photo-1639832899627-5d77c5ce1eb8?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1711141326113-e6b607fd78ef?w=600&h=600&fit=crop&auto=format', null, 'Savory hand-rolled pastry filled with aged cheese, toasted almonds, and fresh herbs.', 20, 'SAV-001', 'Active'),
  (10, 'Celebration Box — Assorted', 'Box Deals', 32000, 'https://images.unsplash.com/photo-1711141326113-e6b607fd78ef?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&h=600&fit=crop&auto=format', 'Best Seller', 'Curated box of 12 assorted pastries — perfect for events and gifting.', 8, 'BOX-001', 'Active'),
  (11, 'Gluten-Free Lemon Tart', 'Cakes', 9800, 'https://images.unsplash.com/photo-1615796701805-2094ac54bbf9?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&h=600&fit=crop&auto=format', 'Gluten-Free', 'Tangy lemon curd in a gluten-free almond pastry shell with candied zest.', 15, 'CAK-003', 'Active'),
  (12, 'Ham & Spinach Quiche', 'Savory', 5500, 'https://images.unsplash.com/photo-1534432182912-63863115e106?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1639832899627-5d77c5ce1eb8?w=600&h=600&fit=crop&auto=format', null, 'Classic French quiche with smoked ham, wilted spinach, and gruyère.', 10, 'SAV-002', 'Active'),
  (13, 'Mini Pastry Gift Box', 'Box Deals', 14500, 'https://images.unsplash.com/photo-1547398847-19d7560a6257?w=600&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1595144780677-6d0b5abbd089?w=600&h=600&fit=crop&auto=format', 'Limited Stock', '6 hand-selected mini pastries beautifully boxed — ideal corporate gift.', 3, 'BOX-002', 'Active')
on conflict (id) do nothing;