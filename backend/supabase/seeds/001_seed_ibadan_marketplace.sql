with parent_categories(name, slug, icon, sort_order) as (
  values
    ('Beauty','beauty','sparkles-outline',10),
    ('Food','food','restaurant-outline',20),
    ('Fashion','fashion','shirt-outline',30),
    ('Repairs','repairs','construct-outline',40),
    ('Home','home','home-outline',50),
    ('Events','events','camera-outline',60),
    ('Tech','tech','phone-portrait-outline',70),
    ('Cleaning','cleaning','water-outline',80),
    ('Wellness','wellness','fitness-outline',90),
    ('Learning','learning','school-outline',100),
    ('Automotive','automotive','car-outline',110)
)
insert into categories (name, slug, icon, sort_order)
select name, slug, icon, sort_order from parent_categories
on conflict (slug) do update set name = excluded.name, icon = excluded.icon, sort_order = excluded.sort_order;

with subcategories(name, slug, icon, parent_slug, sort_order) as (
  values
    ('Barbers','barbers','cut-outline','beauty',1),
    ('Hairdressers','hairdressers','sparkles-outline','beauty',2),
    ('Makeup','makeup','color-palette-outline','beauty',3),
    ('Nails','nails','hand-left-outline','beauty',4),
    ('Bakers','bakers','cafe-outline','food',1),
    ('Caterers','caterers','fast-food-outline','food',2),
    ('Chefs','chefs','restaurant-outline','food',3),
    ('Tailors','tailors','shirt-outline','fashion',1),
    ('Phone Repair','phone-repair','phone-portrait-outline','tech',1),
    ('Laptop Repair','laptop-repair','laptop-outline','tech',2),
    ('Plumbers','plumbers','water-outline','home',1),
    ('Electricians','electricians','flash-outline','home',2),
    ('Photography','photography','camera-outline','events',1),
    ('Laundry','laundry','shirt-outline','cleaning',1),
    ('Tutors','tutors','school-outline','learning',1),
    ('Mechanics','mechanics','car-outline','automotive',1)
)
insert into categories (name, slug, icon, parent_id, sort_order)
select sc.name, sc.slug, sc.icon, pc.id, sc.sort_order
from subcategories sc
join categories pc on pc.slug = sc.parent_slug
on conflict (slug) do update set name = excluded.name, icon = excluded.icon, parent_id = excluded.parent_id, sort_order = excluded.sort_order;

with seed(name, slug, category_slug, area, lat, lng, rating, reviews, completed, tagline, description, phone, image, service_name, service_description, price_type, min_price, max_price, duration, booking_type) as (
  values
    ('Fade & Form Studio','fade-form-studio','barbers','Bodija',7.4364,3.9072,4.9,126,286,'Sharp cuts and grooming appointments near Bodija.','Neighborhood barber studio for fades, beard work, trims, and appointment-based grooming.','+2348107749031','https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80','Signature fade and beard trim','Haircut, line-up, beard shaping, and finishing spray.','starting_from',3000,null,60,'booking'),
    ('Naya Cakes & Treats','naya-cakes-treats','bakers','Akobo',7.4305,3.9641,4.8,91,328,'Fresh cakes, pastries, and celebration treats made in Akobo.','Custom cakes, cupcakes, pastries, bread loaves, and event dessert trays with delivery around Akobo.','+2348024503001','https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80','8-inch birthday cake','Custom buttercream cake with one inscription and delivery option.','starting_from',18000,null,1440,'delivery'),
    ('PixelFix Laptop & Phones','pixelfix-laptop-phones','laptop-repair','Dugbe',7.3908,3.8792,4.7,84,304,'Laptop diagnostics, phone repairs, and device setup.','Repairs for laptop keyboards, batteries, screens, phones, charging ports, and software setup.','+2348154402104','https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80','Laptop diagnostic check','Hardware and software diagnosis with a clear repair estimate.','starting_from',7000,null,120,'delivery'),
    ('GlowByTara Makeup','glowbytara-makeup','makeup','Bodija',7.4212,3.9109,4.9,73,141,'Soft glam, bridal trials, and event-ready looks.','Professional makeup for birthdays, weddings, shoots, graduations, and event glam across Ibadan.','+2348129487760','https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80','Soft glam appointment','Clean event makeup with lashes, skin prep, and finishing touch-up.','starting_from',20000,null,90,'booking'),
    ('CleanWash UI','cleanwash-ui','laundry','UI',7.4443,3.9003,4.4,59,119,'Student-friendly laundry with pickup around UI and Samonda.','Laundry pickup, washing, ironing, duvet cleaning, and express student bundles.','+2348069234430','https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1200&q=80','Express laundry bundle','Wash and iron up to 10 clothing items with pickup and delivery.','fixed',7000,null,1440,'delivery'),
    ('LensCraft Ibadan','lenscraft-ibadan','photography','Jericho',7.3988,3.8819,4.8,84,165,'Portraits, birthdays, small events, and brand shoots.','Photography team for portraits, product photos, birthday coverage, family sessions, and content days.','+2348131014577','https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80','Portrait mini session','One-hour shoot with edited digital photos after selection.','starting_from',35000,null,60,'booking'),
    ('Bodija Pipeworks','bodija-pipeworks','plumbers','Bodija',7.4338,3.9048,4.7,86,214,'Reliable plumbing repairs across Bodija, UI, and Samonda.','Small plumbing team for leaks, blocked drains, pressure pumps, bathrooms, and home repairs.','+2348012341188','https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=80','Leak inspection and repair','Locate visible leaks, replace minor fittings, and test water flow.','starting_from',8500,null,120,'booking'),
    ('CurrentCare Electrical','currentcare-electrical','electricians','Challenge',7.3597,3.8756,4.6,71,176,'Safe wiring, inverter setup, and appliance troubleshooting.','Certified electricians for lighting, sockets, generator changeovers, inverter installation, and fault tracing.','+2348038827744','https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80','Socket and light repair','Troubleshoot and repair faulty sockets, switches, and light points.','starting_from',12000,null,180,'booking'),
    ('StitchHouse Ring Road','stitchhouse-ring-road','tailors','Ring Road',7.3778,3.8788,4.5,104,243,'Native wear, alterations, and quick fittings.','Tailoring studio for agbada, senator wear, dresses, uniforms, and alterations.','+2348056004100','https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80','Native wear sewing','Measurement, cutting, sewing, and fitting for a complete outfit.','starting_from',25000,null,10080,'booking'),
    ('Kemi''s Kitchen Studio','kemis-kitchen-studio','caterers','Samonda',7.4375,3.9201,4.6,109,246,'Small chops, trays, office meals, and intimate catering.','Made-to-order meals, mini catering packs, small chops, family trays, and office lunch arrangements.','+2348143309002','https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80','Small chops party tray','Spring rolls, samosas, puff-puff, peppered protein, and dipping sauce.','starting_from',18000,null,1440,'delivery'),
    ('StyleNest Braids','stylenest-braids','hairdressers','UI',7.4481,3.9045,4.7,97,172,'Protective styles, neat braids, and gentle hair care around UI.','Braiding and styling studio for knotless braids, cornrows, twists, wig prep, and wash-and-style.','+2348113072210','https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80','Medium knotless braids','Neat medium knotless braids with pre-appointment consultation.','starting_from',22000,null,300,'booking'),
    ('AutoCare Challenge','autocare-challenge','mechanics','Challenge',7.3558,3.8781,4.5,81,188,'Car diagnostics, servicing, and roadside inspection.','Mechanic workshop for diagnostics, routine servicing, brake checks, battery support, and inspection visits.','+2348189081187','https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80','Vehicle diagnostic inspection','Engine scan, visible checks, and a repair recommendation summary.','starting_from',15000,null,120,'booking'),
    ('TutorBridge Ibadan','tutorbridge-ibadan','tutors','UI',7.4455,3.8952,4.6,66,121,'Math, English, science, and exam prep tutors around UI.','Screened tutors for primary, secondary, WAEC, JAMB, and adult learning sessions.','+2348172215530','https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80','Math tutoring session','Focused one-on-one support for school topics, homework, or exam prep.','starting_from',10000,null,90,'booking'),
    ('FitWithDara','fitwithdara','wellness','Jericho',7.3979,3.8874,4.7,58,96,'Personal training, home workouts, and accountability plans.','One-on-one and small group training for strength, weight loss, mobility, and weekly routines.','+2348166324150','https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80','Personal training session','Guided strength and mobility session with a weekly action plan.','starting_from',12000,null,60,'booking'),
    ('Mokola Rice Bowl','mokola-rice-bowl','chefs','Mokola',7.4047,3.9023,4.5,128,292,'Quick local meals, office bowls, and party trays.','Jollof rice, fried rice, swallow meals, soups, protein packs, and office lunch bundles.','+2348087452218','https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80','Office lunch bowl','Jollof rice, chicken, plantain, coleslaw, and chilled drink.','fixed',3500,null,40,'delivery'),
    ('BrightSpace Cleaners','brightspace-cleaners','laundry','Jericho',7.3922,3.8822,4.8,64,134,'Calm, professional home and office cleaning.','Deep cleaning, move-in cleaning, post-renovation cleanup, office maintenance, and scheduled home care.','+2348093339130','https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80','Apartment deep clean','Deep cleaning for a one-bedroom apartment with supplied materials.','starting_from',28000,null,240,'booking'),
    ('Oluyole Nail Room','oluyole-nail-room','nails','Oluyole',7.3611,3.8649,4.6,52,88,'Clean nail care, gel sets, and simple nail art.','Appointment-based nail studio for gel polish, acrylics, pedicure, and nail repairs.','+2348102203011','https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80','Gel polish set','Gel polish manicure with basic nail care.','starting_from',8000,null,90,'booking'),
    ('Agodi Decor & Events','agodi-decor-events','photography','Agodi',7.4151,3.9088,4.6,48,79,'Event styling, decor details, and vendor coordination.','Small event decor and styling for birthdays, proposals, showers, and intimate celebrations.','+2348115520099','https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80','Intimate event decor','Simple backdrop, table styling, and setup coordination.','starting_from',45000,null,240,'booking'),
    ('Akobo Hair Lab','akobo-hair-lab','hairdressers','Akobo',7.4294,3.9632,4.7,89,154,'Wigs, installs, revamps, and everyday styling.','Hair studio for wig installs, natural hair care, weaves, silk press, and revamps.','+2348127712340','https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80','Wig install','Clean install with styling and finishing.','starting_from',15000,null,120,'booking'),
    ('Ring Road PhotoWorks','ring-road-photoworks','photography','Ring Road',7.3785,3.8829,4.7,62,101,'Studio portraits and event photography around Ring Road.','Studio and on-location photo sessions for birthdays, maternity, family, products, and small events.','+2348139004512','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80','Studio portrait session','Thirty-minute portrait session with three edited images.','fixed',25000,null,45,'booking'),
    ('Dugbe ScreenCare','dugbe-screencare','phone-repair','Dugbe',7.3917,3.8784,4.6,77,204,'Phone screen repairs with clear diagnostics.','Screen replacement, battery swaps, charging ports, and diagnostics for popular devices.','+2348072110199','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80','Phone screen diagnostic','Device check and repair estimate before replacement.','starting_from',15000,null,90,'delivery'),
    ('Mokola Pastry Box','mokola-pastry-box','bakers','Mokola',7.4074,3.9003,4.6,69,151,'Pastry boxes, cupcakes, and office treats.','Fresh pastry boxes, cupcakes, meat pies, doughnuts, and small event dessert packs.','+2348067719920','https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80','Mixed pastry box','Meat pies, doughnuts, cupcakes, and sausage rolls.','fixed',6500,null,480,'delivery'),
    ('Oluyole Interior Touch','oluyole-interior-touch','plumbers','Oluyole',7.3543,3.8642,4.5,41,65,'Small interior fixes and finishings for homes.','Curtain rods, shelves, minor plumbing fittings, wall touchups, and light decor installation.','+2348091004200','https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80','Home finishing visit','Small installation and finishing consultation.','starting_from',18000,null,180,'booking'),
    ('Agodi Fitness Club','agodi-fitness-club','wellness','Agodi',7.4172,3.9042,4.5,55,104,'Small group fitness and beginner-friendly coaching.','Fitness coaching for weight loss, strength, mobility, and accountability in small groups.','+2348165510020','https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80','Small group session','Guided workout session for up to five people.','fixed',5000,null,60,'booking'),
    ('Challenge AutoWash Plus','challenge-autowash-plus','mechanics','Challenge',7.3571,3.8715,4.4,44,112,'Car wash, interior cleaning, and quick inspection.','Car wash and detailing with basic tire, battery, and fluid inspection options.','+2348185512231','https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80','Interior and exterior wash','Detailed car wash with dashboard and mat cleaning.','fixed',6000,null,90,'booking'),
    ('Jericho Bridal Studio','jericho-bridal-studio','makeup','Jericho',7.3982,3.8793,4.8,82,117,'Bridal makeup, tying, and pre-wedding glam.','Bridal and event beauty studio for makeup, gele, trials, and wedding morning packages.','+2348123007781','https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=80','Bridal trial glam','Trial makeup session before the wedding day.','starting_from',30000,null,120,'booking'),
    ('Samonda Learning Nook','samonda-learning-nook','tutors','Samonda',7.4389,3.9213,4.5,36,72,'After-school support and exam practice.','Tutoring center for mathematics, English, basic science, reading, WAEC and JAMB prep.','+2348174410023','https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80','After-school tutoring','Two-hour after-school academic support session.','starting_from',8000,null,120,'booking'),
    ('Bodija Fresh Bowls','bodija-fresh-bowls','chefs','Bodija',7.4321,3.9091,4.6,74,138,'Healthy bowls, smoothies, and office lunch packs.','Fresh food bowls, smoothies, salads, wraps, and office meal prep delivered around Bodija.','+2348083221550','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80','Chicken veggie bowl','Fresh rice and veggie bowl with grilled chicken.','fixed',4500,null,45,'delivery'),
    ('UI Laptop Clinic','ui-laptop-clinic','laptop-repair','UI',7.4463,3.8951,4.5,63,134,'Student-friendly laptop repair and upgrades.','Laptop cleaning, RAM upgrades, keyboard replacements, diagnostics, software setup, and backup support.','+2348158871008','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80','Laptop tune-up','System cleanup, diagnostics, and performance recommendation.','starting_from',9000,null,120,'delivery'),
    ('Ring Road Laundry Co','ring-road-laundry-co','laundry','Ring Road',7.3772,3.8815,4.5,57,99,'Pickup laundry for busy professionals.','Laundry pickup, wash, fold, ironing, duvet care, and express workwear bundles.','+2348064310992','https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80','Workwear bundle','Wash and iron five office outfits with pickup.','fixed',5500,null,1440,'delivery'),
    ('Akobo Event Bites','akobo-event-bites','caterers','Akobo',7.4288,3.9609,4.6,68,122,'Event trays, small chops, and party food.','Catering for birthdays, office events, showers, and family gatherings with delivery around Akobo.','+2348149950003','https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80','Party food tray','Jollof, protein, plantain, and small chops tray.','starting_from',25000,null,1440,'delivery')
)
insert into businesses (name, slug, tagline, description, verification_status, average_rating, review_count, completed_booking_count, phone, is_active, accepts_bookings)
select name, slug, tagline, description, 'verified', rating, reviews, completed, phone, true, true
from seed
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  description = excluded.description,
  verification_status = excluded.verification_status,
  average_rating = excluded.average_rating,
  review_count = excluded.review_count,
  completed_booking_count = excluded.completed_booking_count,
  phone = excluded.phone,
  updated_at = now();

with seed(name, slug, category_slug, area, lat, lng, image, service_name, service_description, price_type, min_price, max_price, duration, booking_type) as (
  select * from (values
    ('Fade & Form Studio','fade-form-studio','barbers','Bodija',7.4364,3.9072,'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80','Signature fade and beard trim','Haircut, line-up, beard shaping, and finishing spray.','starting_from',3000,null,60,'booking'),
    ('Naya Cakes & Treats','naya-cakes-treats','bakers','Akobo',7.4305,3.9641,'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80','8-inch birthday cake','Custom buttercream cake with one inscription and delivery option.','starting_from',18000,null,1440,'delivery'),
    ('PixelFix Laptop & Phones','pixelfix-laptop-phones','laptop-repair','Dugbe',7.3908,3.8792,'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80','Laptop diagnostic check','Hardware and software diagnosis with a clear repair estimate.','starting_from',7000,null,120,'delivery'),
    ('GlowByTara Makeup','glowbytara-makeup','makeup','Bodija',7.4212,3.9109,'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80','Soft glam appointment','Clean event makeup with lashes, skin prep, and finishing touch-up.','starting_from',20000,null,90,'booking'),
    ('CleanWash UI','cleanwash-ui','laundry','UI',7.4443,3.9003,'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1200&q=80','Express laundry bundle','Wash and iron up to 10 clothing items with pickup and delivery.','fixed',7000,null,1440,'delivery')
  ) as s(name, slug, category_slug, area, lat, lng, image, service_name, service_description, price_type, min_price, max_price, duration, booking_type)
  union all
  select name, slug, category_slug, area, lat, lng, image, service_name, service_description, price_type, min_price, max_price, duration, booking_type
  from (select * from (values
    ('LensCraft Ibadan','lenscraft-ibadan','photography','Jericho',7.3988,3.8819,'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80','Portrait mini session','One-hour shoot with edited digital photos after selection.','starting_from',35000,null,60,'booking'),
    ('Bodija Pipeworks','bodija-pipeworks','plumbers','Bodija',7.4338,3.9048,'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=80','Leak inspection and repair','Locate visible leaks, replace minor fittings, and test water flow.','starting_from',8500,null,120,'booking'),
    ('CurrentCare Electrical','currentcare-electrical','electricians','Challenge',7.3597,3.8756,'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80','Socket and light repair','Troubleshoot and repair faulty sockets, switches, and light points.','starting_from',12000,null,180,'booking'),
    ('StitchHouse Ring Road','stitchhouse-ring-road','tailors','Ring Road',7.3778,3.8788,'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80','Native wear sewing','Measurement, cutting, sewing, and fitting for a complete outfit.','starting_from',25000,null,10080,'booking'),
    ('Kemi''s Kitchen Studio','kemis-kitchen-studio','caterers','Samonda',7.4375,3.9201,'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80','Small chops party tray','Spring rolls, samosas, puff-puff, peppered protein, and dipping sauce.','starting_from',18000,null,1440,'delivery'),
    ('StyleNest Braids','stylenest-braids','hairdressers','UI',7.4481,3.9045,'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80','Medium knotless braids','Neat medium knotless braids with pre-appointment consultation.','starting_from',22000,null,300,'booking'),
    ('AutoCare Challenge','autocare-challenge','mechanics','Challenge',7.3558,3.8781,'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80','Vehicle diagnostic inspection','Engine scan, visible checks, and a repair recommendation summary.','starting_from',15000,null,120,'booking'),
    ('TutorBridge Ibadan','tutorbridge-ibadan','tutors','UI',7.4455,3.8952,'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80','Math tutoring session','Focused one-on-one support for school topics, homework, or exam prep.','starting_from',10000,null,90,'booking'),
    ('FitWithDara','fitwithdara','wellness','Jericho',7.3979,3.8874,'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80','Personal training session','Guided strength and mobility session with a weekly action plan.','starting_from',12000,null,60,'booking'),
    ('Mokola Rice Bowl','mokola-rice-bowl','chefs','Mokola',7.4047,3.9023,'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80','Office lunch bowl','Jollof rice, chicken, plantain, coleslaw, and chilled drink.','fixed',3500,null,40,'delivery'),
    ('BrightSpace Cleaners','brightspace-cleaners','laundry','Jericho',7.3922,3.8822,'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80','Apartment deep clean','Deep cleaning for a one-bedroom apartment with supplied materials.','starting_from',28000,null,240,'booking'),
    ('Oluyole Nail Room','oluyole-nail-room','nails','Oluyole',7.3611,3.8649,'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80','Gel polish set','Gel polish manicure with basic nail care.','starting_from',8000,null,90,'booking'),
    ('Agodi Decor & Events','agodi-decor-events','photography','Agodi',7.4151,3.9088,'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80','Intimate event decor','Simple backdrop, table styling, and setup coordination.','starting_from',45000,null,240,'booking'),
    ('Akobo Hair Lab','akobo-hair-lab','hairdressers','Akobo',7.4294,3.9632,'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80','Wig install','Clean install with styling and finishing.','starting_from',15000,null,120,'booking'),
    ('Ring Road PhotoWorks','ring-road-photoworks','photography','Ring Road',7.3785,3.8829,'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80','Studio portrait session','Thirty-minute portrait session with three edited images.','fixed',25000,null,45,'booking'),
    ('Dugbe ScreenCare','dugbe-screencare','phone-repair','Dugbe',7.3917,3.8784,'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80','Phone screen diagnostic','Device check and repair estimate before replacement.','starting_from',15000,null,90,'delivery'),
    ('Mokola Pastry Box','mokola-pastry-box','bakers','Mokola',7.4074,3.9003,'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80','Mixed pastry box','Meat pies, doughnuts, cupcakes, and sausage rolls.','fixed',6500,null,480,'delivery'),
    ('Oluyole Interior Touch','oluyole-interior-touch','plumbers','Oluyole',7.3543,3.8642,'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80','Home finishing visit','Small installation and finishing consultation.','starting_from',18000,null,180,'booking'),
    ('Agodi Fitness Club','agodi-fitness-club','wellness','Agodi',7.4172,3.9042,'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80','Small group session','Guided workout session for up to five people.','fixed',5000,null,60,'booking'),
    ('Challenge AutoWash Plus','challenge-autowash-plus','mechanics','Challenge',7.3571,3.8715,'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80','Interior and exterior wash','Detailed car wash with dashboard and mat cleaning.','fixed',6000,null,90,'booking'),
    ('Jericho Bridal Studio','jericho-bridal-studio','makeup','Jericho',7.3982,3.8793,'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=80','Bridal trial glam','Trial makeup session before the wedding day.','starting_from',30000,null,120,'booking'),
    ('Samonda Learning Nook','samonda-learning-nook','tutors','Samonda',7.4389,3.9213,'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80','After-school tutoring','Two-hour after-school academic support session.','starting_from',8000,null,120,'booking'),
    ('Bodija Fresh Bowls','bodija-fresh-bowls','chefs','Bodija',7.4321,3.9091,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80','Chicken veggie bowl','Fresh rice and veggie bowl with grilled chicken.','fixed',4500,null,45,'delivery'),
    ('UI Laptop Clinic','ui-laptop-clinic','laptop-repair','UI',7.4463,3.8951,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80','Laptop tune-up','System cleanup, diagnostics, and performance recommendation.','starting_from',9000,null,120,'delivery'),
    ('Ring Road Laundry Co','ring-road-laundry-co','laundry','Ring Road',7.3772,3.8815,'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80','Workwear bundle','Wash and iron five office outfits with pickup.','fixed',5500,null,1440,'delivery'),
    ('Akobo Event Bites','akobo-event-bites','caterers','Akobo',7.4288,3.9609,'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80','Party food tray','Jollof, protein, plantain, and small chops tray.','starting_from',25000,null,1440,'delivery')
  ) as s(name, slug, category_slug, area, lat, lng, image, service_name, service_description, price_type, min_price, max_price, duration, booking_type)) x
)
insert into business_locations (business_id, address, area, city, state, latitude, longitude, service_radius_km)
select b.id, seed.area || ', Ibadan', seed.area, 'Ibadan', 'Oyo', seed.lat, seed.lng, 10
from seed join businesses b on b.slug = seed.slug
on conflict do nothing;

with seed as (
  select b.id business_id, c.id category_id, b.slug
  from businesses b
  join lateral (
    select case
      when b.slug like '%cake%' or b.slug like '%pastry%' then 'bakers'
      when b.slug like '%kitchen%' or b.slug like '%rice%' or b.slug like '%bowls%' then 'chefs'
      when b.slug like '%event-bites%' then 'caterers'
      when b.slug like '%fade%' then 'barbers'
      when b.slug like '%makeup%' or b.slug like '%bridal%' then 'makeup'
      when b.slug like '%braids%' or b.slug like '%hair%' then 'hairdressers'
      when b.slug like '%nail%' then 'nails'
      when b.slug like '%laptop%' then 'laptop-repair'
      when b.slug like '%screen%' then 'phone-repair'
      when b.slug like '%pipe%' or b.slug like '%interior%' then 'plumbers'
      when b.slug like '%electrical%' then 'electricians'
      when b.slug like '%stitch%' then 'tailors'
      when b.slug like '%lens%' or b.slug like '%photo%' or b.slug like '%decor%' then 'photography'
      when b.slug like '%wash%' or b.slug like '%clean%' or b.slug like '%laundry%' then 'laundry'
      when b.slug like '%tutor%' or b.slug like '%learning%' then 'tutors'
      when b.slug like '%auto%' then 'mechanics'
      when b.slug like '%fit%' then 'wellness'
      else 'beauty'
    end slug
  ) matched on true
  join categories c on c.slug = matched.slug
)
insert into business_categories (business_id, category_id)
select business_id, category_id from seed
on conflict do nothing;

insert into business_images (business_id, storage_path, public_url, sort_order, is_cover)
select b.id, 'seed/' || b.slug || '.jpg', seed.image, 0, true
from businesses b
join (
  select slug, image from (values
    ('fade-form-studio','https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80'),
    ('naya-cakes-treats','https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80'),
    ('pixelfix-laptop-phones','https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80')
  ) as v(slug, image)
) seed on seed.slug = b.slug
where not exists (select 1 from business_images bi where bi.business_id = b.id and bi.is_cover = true);

insert into business_images (business_id, storage_path, public_url, sort_order, is_cover)
select b.id, 'seed/' || b.slug || '.jpg', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80', 0, true
from businesses b
where not exists (select 1 from business_images bi where bi.business_id = b.id and bi.is_cover = true);

insert into services (business_id, name, description, price_type, min_price, duration_minutes, booking_type, lead_time_hours, sort_order)
select b.id,
       'Book ' || b.name,
       coalesce(b.tagline, 'Local service booking'),
       'starting_from',
       greatest(3000, (1000 + (random() * 35000)::int)),
       90,
       'booking',
       2,
       0
from businesses b
where not exists (select 1 from services s where s.business_id = b.id);

insert into business_hours (business_id, weekday, opens_at, closes_at, is_closed)
select b.id, day, '08:00', '18:00', false
from businesses b
cross join generate_series(1, 6) day
on conflict (business_id, weekday) do nothing;
