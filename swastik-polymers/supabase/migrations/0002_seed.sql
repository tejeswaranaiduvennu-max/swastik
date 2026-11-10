-- ============================================================
-- Swastik Polymers — seed: business_settings (1 row) + 12 products.
-- Safe to re-run (idempotent via unique slug / single settings row).
-- ============================================================

insert into public.business_settings
  (business_name, proprietor_name, phone, whatsapp, email, address, gstin,
   minimum_order_quantity, hero_heading, business_description, logo_url)
select
  'Swastik Polymers', 'Chintha Achutch', '9866596129', '919866596129', null,
  '8-18-303 Industrial Estate, V.T. Agraharam, Vizianagaram, Andhra Pradesh.',
  '3EDPFA6603F1ZW', 100,
  'Reliable PVC Solutions for Every Electrical Need.',
  'Swastik Polymers — Manufacturers of PVC Electrical Pipes & Fittings and Suppliers of Garden Pipes.',
  null
where not exists (select 1 from public.business_settings);

insert into public.products (slug, name, description, category, image_url, is_featured, is_active) values
  ('pvc-junction-boxes','PVC Junction Boxes','Durable PVC junction boxes for safe, concealed electrical wiring connections.','PVC Electrical Products','/products/pvc-junction-boxes.svg',true,true),
  ('pvc-bends','PVC Bends','Smooth-radius PVC bends for clean conduit routing around corners.','PVC Electrical Products','/products/pvc-bends.svg',false,true),
  ('pvc-electrical-fittings','PVC Electrical Fittings','Complete range of couplers, connectors and accessories for conduit systems.','PVC Electrical Products','/products/pvc-electrical-fittings.svg',true,true),
  ('pvc-conduit-pipes','PVC Conduit Pipes','Rigid PVC conduit pipes engineered for reliable electrical cable protection.','PVC Electrical Products','/products/pvc-conduit-pipes.svg',true,true),
  ('flexible-hoses','Flexible Hoses','Flexible PVC hoses for adaptable wiring runs in tight installations.','PVC Electrical Products','/products/flexible-hoses.svg',false,true),
  ('nail-clamps','Nail Clamps','Nail clamps for quick, secure fastening of cables and conduit to surfaces.','Cable Management Products','/products/nail-clamps.svg',false,true),
  ('cable-ties','Cable Ties','Strong nylon cable ties for neat bundling and cable management.','Cable Management Products','/products/cable-ties.svg',false,true),
  ('modular-surface-boxes','Modular Surface Boxes','Surface-mount modular boxes compatible with standard modular switch plates.','Electrical Boxes and Accessories','/products/modular-surface-boxes.svg',false,true),
  ('modular-gang-boxes','Modular Gang Boxes','Multi-gang modular boxes for flush-mount switch and socket assemblies.','Electrical Boxes and Accessories','/products/modular-gang-boxes.svg',false,true),
  ('metal-boxes','Metal Boxes','Sturdy metal concealed boxes for durable switchboard installations.','Electrical Boxes and Accessories','/products/metal-boxes.svg',false,true),
  ('black-star-screws','Black Star Screws','Black star-head screws for fixing switch plates and electrical accessories.','Electrical Boxes and Accessories','/products/black-star-screws.svg',false,true),
  ('garden-pipes','Garden Pipes','Flexible garden pipes supplied for irrigation and general water use.','Garden Products','/products/garden-pipes.svg',true,true)
on conflict (slug) do nothing;
