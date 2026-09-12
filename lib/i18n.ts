import { useLanguageStore } from "@/store/language.store";

type Vars = Record<string, string | number>;

const en = {
  // common
  "common.add": "Add",
  "common.addToCart": "Add to Cart",
  "common.orderNow": "Order Now",
  "common.viewAll": "View All",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.saveChanges": "Save Changes",
  "common.saving": "Saving…",
  "common.tryAgain": "Try Again",
  "common.goBack": "Go back",
  "common.clearAll": "Clear all",
  "common.markAllRead": "Mark all read",
  "common.loading": "Loading…",
  "common.free": "Free",
  "common.minutes": "Minutes",
  "common.items": "Items",
  "common.delivery": "Delivery",
  "common.min": "min",
  "common.somethingWrong": "Something went wrong",

  // tabs
  "tab.home": "Home",
  "tab.search": "Search",
  "tab.cart": "Cart",
  "tab.profile": "Profile",

  // home
  "home.morning": "Good Morning",
  "home.afternoon": "Good Afternoon",
  "home.evening": "Good Evening",
  "home.whatsUp": "What's up, {name}?",
  "home.craving": "What are you craving?",
  "home.searchPlaceholder": "Search for meals…",
  "home.popularMeals": "Popular Meals",
  "home.bestseller": "Bestseller",
  "home.popular": "Popular",
  "home.exclusiveOffer": "Exclusive Offer",
  "home.upToOff": "Up to {n}% OFF",
  "home.onCombos": "On selected combo meals",
  "home.noMeals": "No meals yet — seed the menu to see them here.",
  "home.limitedTime": "LIMITED TIME",
  "home.saveN": "SAVE {n}%",
  "home.fromPrice": "from ${price}",

  // search
  "search.title": "Search",
  "search.subtitle": "Find your favorite food",
  "search.placeholder": "Search for pizzas, burgers…",
  "search.all": "All",
  "search.noResults": "Nothing matched your search",
  "search.noResultsHint": "Try a different search term or check for typos.",
  "search.fromPrice": "From ${price}",
  "search.viewDetails": "View Details",

  // details
  "details.aboutMeal": "About this meal",
  "details.addToppings": "Add toppings",
  "details.addSides": "Add sides",
  "details.calories": "Calories",
  "details.protein": "Protein",
  "details.deliveryTime": "25 min",
  "details.defaultDesc":
    "Freshly prepared with high-quality ingredients and delivered hot to your door.",
  "details.addToCartTotal": "Add to Cart · ${amount}",

  // offer details
  "offer.aboutDeal": "About this deal",
  "offer.included": "What's included",
  "offer.endsIn": "Ends in {n} {unit}",
  "offer.day": "day",
  "offer.days": "days",
  "offer.validUntil": "Valid until {date}",
  "offer.saveN": "Save {n}%",

  // offer deal content (constants/offers.constants.ts)
  "offerData.summer-combo.title": "Summer Combo",
  "offerData.summer-combo.desc":
    "Beat the heat with our refreshing Summer Combo! Enjoy a juicy beef burger, crispy fries, and an ice-cold drink — the perfect meal for sunny days.",
  "offerData.burger-bash.title": "Burger Bash",
  "offerData.burger-bash.desc":
    "Double the burger, double the fun! Get two premium juicy burgers loaded with cheese, bacon, and fresh veggies. Perfect for sharing or for the burger lover in you!",
  "offerData.pizza-party.title": "Pizza Party",
  "offerData.pizza-party.desc":
    "Party time starts here! A large pizza loaded with your favorite toppings, served with garlic bread and a refreshing drink. Perfect for family nights or hanging out with friends!",
  "offerData.burrito-delight.title": "Burrito Delight",
  "offerData.burrito-delight.desc":
    "Spice up your day with our authentic Mexican burrito! Packed with seasoned beef, rice, beans, cheese, and fresh salsa. Comes with crispy tortilla chips and guacamole!",

  // offer included-items (constants/offers.constants.ts, via OFFER_ITEM_KEYS)
  "offerItem.beefBurger": "Beef Burger",
  "offerItem.largeFries": "Large Fries",
  "offerItem.softDrink500": "Soft Drink (500ml)",
  "offerItem.premiumBeefBurger": "Premium Beef Burger",
  "offerItem.cheeseSlices": "Cheese Slices",
  "offerItem.baconStrips": "Bacon Strips",
  "offerItem.softDrink": "Soft Drink",
  "offerItem.largePizza12": 'Large Pizza (12")',
  "offerItem.garlicBread": "Garlic Bread",
  "offerItem.mozzarellaSticks": "Mozzarella Sticks",
  "offerItem.softDrink1L": "Soft Drink (1L)",
  "offerItem.beefBurrito": "Beef Burrito",
  "offerItem.mexicanRice": "Mexican Rice",
  "offerItem.refriedBeans": "Refried Beans",
  "offerItem.tortillaChips": "Tortilla Chips",
  "offerItem.guacamole": "Guacamole",

  // cart
  "cart.title": "Your Cart",
  "cart.titleN": "Your Cart ({n})",
  "cart.empty": "Your cart is empty",
  "cart.emptyHint": "Add some delicious items to get started!",
  "cart.browseMenu": "Browse menu",
  "cart.orderSummary": "Order Summary",
  "cart.subtotalN": "Subtotal ({n} items)",
  "cart.discount": "Discount",
  "cart.total": "Total",
  "cart.checkout": "Checkout",
  "cart.proceedTo": "Proceed to Checkout · ${amount}",
  "cart.placeOrder": "Place Order · ${amount}",
  "cart.processing": "Processing…",
  "cart.deliverTo": "Deliver to",
  "cart.home": "Home",
  "cart.work": "Work",
  "cart.deliveryAddress": "Delivery address",
  "cart.noAddress": "No address yet",
  "cart.chooseAddress": "Tap to choose a delivery address",
  "cart.addAddress": "Add a different address",
  "cart.deliverHere": "Deliver here",
  "cart.addressPlaceholder": "Street, building, apartment…",
  "cart.paymentMethod": "Payment method",
  "cart.card": "Credit / Debit Card",
  "cart.cardSub": "Visa, Mastercard",
  "cart.cash": "Cash on Delivery",
  "cart.cashSub": "Pay when your order arrives",
  "cart.orderConfirmed": "Order confirmed!",
  "cart.orderConfirmedMsg":
    "Your food is being prepared and will be delivered shortly.",
  "cart.backToHome": "Back to Home",
  "cart.paymentCancelled": "Payment cancelled",
  "cart.paymentCancelledMsg":
    "Your payment was cancelled. Your cart items are still saved.",

  // card sheet
  "card.title": "Card payment",
  "card.subtitle": "Enter your card details to pay ${amount}",
  "card.number": "Card number",
  "card.expiry": "Expiry",
  "card.cvc": "CVC",
  "card.nameOnCard": "Name on card",
  "card.fullName": "Full name",
  "card.pay": "Pay ${amount}",
  "card.demo": "🔒 Demo mode — no real card is charged",

  // toast
  "toast.greatChoice": "Great choice!",
  "toast.greatChoiceMsg":
    "Your first pick is in the cart — keep browsing or check out.",
  "toast.added": "Added to cart",
  "toast.addedMsg": "Your cart is getting tastier. Review it or keep adding.",
  "toast.reviewOrder": "Review order",
  "toast.keepBrowsing": "Keep browsing",

  // notifications
  "notif.title": "Notifications",
  "notif.empty": "You're all caught up",
  "notif.emptyHint": "Order updates and fresh deals will show up here.",

  // favorites
  "fav.title": "Favorites",
  "fav.empty": "No favorites yet",
  "fav.emptyHint": "Tap the heart on any meal or deal to save it here.",
  "fav.meal": "Meal",
  "fav.deal": "Deal",

  // profile
  "profile.title": "Profile",
  "profile.editProfile": "Edit Profile",
  "profile.logout": "Log out",
  "profile.logoutTitle": "Log out?",
  "profile.logoutMsg": "You'll need to sign in again to place orders.",
  "profile.stayIn": "Stay signed in",
  "profile.personalInfo": "Personal information",
  "profile.fullName": "Full Name",
  "profile.email": "Email",
  "profile.phone": "Phone Number",
  "profile.notProvided": "Not provided",
  "profile.addresses": "Addresses",
  "profile.homeAddress": "Home Address",
  "profile.workAddress": "Work Address",
  "profile.photoUpdated": "Photo updated",
  "profile.photoUpdatedMsg": "Your new profile picture is live.",
  "profile.uploadFailed": "Upload failed",

  // edit profile
  "edit.title": "Edit Profile",
  "edit.changePhotoHint": "Change your photo from the Profile screen",
  "edit.enterName": "Enter your full name",
  "edit.enterPhone": "Enter your phone number",
  "edit.enterHome": "Enter your home address",
  "edit.enterWork": "Enter your work address",
  "edit.updated": "Profile updated",
  "edit.updatedMsg": "Your changes have been saved.",
  "edit.backToProfile": "Back to Profile",

  // settings
  "settings.title": "Settings",
  "settings.appearance": "Appearance",
  "settings.light": "Light",
  "settings.dark": "Dark",
  "settings.system": "Match system",
  "settings.language": "Language",
  "settings.restartHint": "Restart the app to fully apply the language direction.",

  // auth
  "auth.welcomeBack": "Welcome back",
  "auth.welcomeBackSub": "Sign in to keep ordering your favourites",
  "auth.createAccount": "Create account",
  "auth.createAccountSub": "Join Foodify — your first delivery is on us",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.fullName": "Full name",
  "auth.yourPassword": "Your password",
  "auth.min8": "At least 8 characters",
  "auth.signIn": "Sign In",
  "auth.signUp": "Sign Up",
  "auth.noAccount": "Don't have an account?",
  "auth.haveAccount": "Already have an account?",
  "auth.errInvalidCreds":
    "Invalid email or password. Please check your credentials and try again.",
  "auth.errNoUser": "No account found with this email. Please sign up first.",
  "auth.errNetwork": "Network error. Please check your internet connection.",
  "auth.errRateLimit": "Too many attempts. Please try again later.",
  "auth.errGeneric": "Something went wrong! Please try again.",
  "auth.errFillFields": "Please fill all the fields",
  "auth.errEmailPassword": "Please enter your email and password",
  "auth.errInvalidEmail": "Please enter a valid email address",
  "auth.errNameLen": "Name must be at least 2 characters long",
  "auth.errPasswordLen": "Password must be at least 8 characters long",
  "auth.errEmailExists":
    "This email is already registered. Please use a different email or sign in.",

  // onboarding
  "onb.skip": "Skip",
  "onb.next": "Next",
  "onb.getStarted": "Get Started",
  "onb.1.title": "Discover great food",
  "onb.1.desc": "Find your favorite meals from top restaurants near you",
  "onb.2.title": "Fast & easy ordering",
  "onb.2.desc": "Order in seconds and track your food in real time",
  "onb.3.title": "Quick delivery",
  "onb.3.desc": "Fresh food delivered to your door",
};

type Key = keyof typeof en;

const ar: Record<Key, string> = {
  "common.add": "أضف",
  "common.addToCart": "أضف إلى السلة",
  "common.orderNow": "اطلب الآن",
  "common.viewAll": "عرض الكل",
  "common.cancel": "إلغاء",
  "common.save": "حفظ",
  "common.saveChanges": "حفظ التغييرات",
  "common.saving": "جارٍ الحفظ…",
  "common.tryAgain": "حاول مرة أخرى",
  "common.goBack": "رجوع",
  "common.clearAll": "مسح الكل",
  "common.markAllRead": "تحديد الكل كمقروء",
  "common.loading": "جارٍ التحميل…",
  "common.free": "مجاني",
  "common.minutes": "دقيقة",
  "common.items": "عناصر",
  "common.delivery": "التوصيل",
  "common.min": "دقيقة",
  "common.somethingWrong": "حدث خطأ ما",

  "tab.home": "الرئيسية",
  "tab.search": "بحث",
  "tab.cart": "السلة",
  "tab.profile": "حسابي",

  "home.morning": "صباح الخير",
  "home.afternoon": "مساء الخير",
  "home.evening": "مساء الخير",
  "home.whatsUp": "أهلاً يا {name}!",
  "home.craving": "بتشتهي إيه النهاردة؟",
  "home.searchPlaceholder": "ابحث عن وجبة…",
  "home.popularMeals": "الأكثر طلباً",
  "home.bestseller": "الأكثر مبيعاً",
  "home.popular": "شائع",
  "home.exclusiveOffer": "عرض حصري",
  "home.upToOff": "خصم يصل إلى {n}%",
  "home.onCombos": "على وجبات مختارة",
  "home.noMeals": "لا توجد وجبات بعد.",
  "home.limitedTime": "لفترة محدودة",
  "home.saveN": "وفّر {n}%",
  "home.fromPrice": "يبدأ من ${price}",

  "search.title": "بحث",
  "search.subtitle": "ابحث عن أكلك المفضل",
  "search.placeholder": "ابحث عن بيتزا، برجر…",
  "search.all": "الكل",
  "search.noResults": "لا توجد نتائج مطابقة",
  "search.noResultsHint": "جرّب كلمة بحث مختلفة أو تأكد من الإملاء.",
  "search.fromPrice": "يبدأ من ${price}",
  "search.viewDetails": "عرض التفاصيل",

  "details.aboutMeal": "عن هذه الوجبة",
  "details.addToppings": "أضف إضافات",
  "details.addSides": "أضف أطباق جانبية",
  "details.calories": "سعرات",
  "details.protein": "بروتين",
  "details.deliveryTime": "٢٥ دقيقة",
  "details.defaultDesc": "محضّرة طازجة بمكونات عالية الجودة وتوصل لك ساخنة.",
  "details.addToCartTotal": "أضف إلى السلة · ${amount}",

  "offer.aboutDeal": "عن هذا العرض",
  "offer.included": "ماذا يتضمن العرض",
  "offer.endsIn": "ينتهي خلال {n} {unit}",
  "offer.day": "يوم",
  "offer.days": "أيام",
  "offer.validUntil": "ساري حتى {date}",
  "offer.saveN": "وفّر {n}%",

  "offerData.summer-combo.title": "كومبو الصيف",
  "offerData.summer-combo.desc":
    "قاوم الحر مع كومبو الصيف المنعش! برجر لحم طري، بطاطس مقرمشة، ومشروب مثلج — الوجبة المثالية للأيام الحارة.",
  "offerData.burger-bash.title": "مهرجان البرجر",
  "offerData.burger-bash.desc":
    "ضاعف البرجر، ضاعف المتعة! برجرين مميزين محشوّين بالجبنة والبيكون والخضار الطازجة. مثالي للمشاركة أو لعشاق البرجر.",
  "offerData.pizza-party.title": "حفلة البيتزا",
  "offerData.pizza-party.desc":
    "وقت الحفلة بدأ! بيتزا كبيرة محملة بإضافاتك المفضلة، مع خبز الثوم ومشروب منعش. مثالية لسهرات العيلة أو مع الأصحاب!",
  "offerData.burrito-delight.title": "بوريتو ديلايت",
  "offerData.burrito-delight.desc":
    "ضيف نكهة مكسيكية أصلية ليومك مع البوريتو! محشو بلحم متبل، أرز، فاصوليا، جبنة، وصلصة طازجة. يُقدَّم مع تشيبس التورتيلا والجواكامولي!",

  "offerItem.beefBurger": "برجر لحم",
  "offerItem.largeFries": "بطاطس كبيرة",
  "offerItem.softDrink500": "مشروب غازي (٥٠٠ مل)",
  "offerItem.premiumBeefBurger": "برجر لحم مميز",
  "offerItem.cheeseSlices": "شرائح جبنة",
  "offerItem.baconStrips": "شرائح بيكون",
  "offerItem.softDrink": "مشروب غازي",
  "offerItem.largePizza12": "بيتزا كبيرة (١٢ بوصة)",
  "offerItem.garlicBread": "خبز بالثوم",
  "offerItem.mozzarellaSticks": "أصابع موزاريلا",
  "offerItem.softDrink1L": "مشروب غازي (١ لتر)",
  "offerItem.beefBurrito": "بوريتو لحم",
  "offerItem.mexicanRice": "أرز مكسيكي",
  "offerItem.refriedBeans": "فاصوليا مهروسة",
  "offerItem.tortillaChips": "تشيبس تورتيلا",
  "offerItem.guacamole": "جواكامولي",

  "cart.title": "سلتك",
  "cart.titleN": "سلتك ({n})",
  "cart.empty": "سلتك فارغة",
  "cart.emptyHint": "أضف بعض الأصناف اللذيذة لتبدأ!",
  "cart.browseMenu": "تصفح المنيو",
  "cart.orderSummary": "ملخص الطلب",
  "cart.subtotalN": "المجموع ({n} عناصر)",
  "cart.discount": "الخصم",
  "cart.total": "الإجمالي",
  "cart.checkout": "الدفع",
  "cart.proceedTo": "المتابعة للدفع · ${amount}",
  "cart.placeOrder": "تأكيد الطلب · ${amount}",
  "cart.processing": "جارٍ المعالجة…",
  "cart.deliverTo": "التوصيل إلى",
  "cart.home": "المنزل",
  "cart.work": "العمل",
  "cart.deliveryAddress": "عنوان التوصيل",
  "cart.noAddress": "لا يوجد عنوان",
  "cart.chooseAddress": "اضغط لاختيار عنوان التوصيل",
  "cart.addAddress": "أضف عنواناً آخر",
  "cart.deliverHere": "وصّل هنا",
  "cart.addressPlaceholder": "الشارع، المبنى، الشقة…",
  "cart.paymentMethod": "طريقة الدفع",
  "cart.card": "بطاقة ائتمان / خصم",
  "cart.cardSub": "فيزا، ماستركارد",
  "cart.cash": "الدفع عند الاستلام",
  "cart.cashSub": "ادفع عند وصول طلبك",
  "cart.orderConfirmed": "تم تأكيد الطلب!",
  "cart.orderConfirmedMsg": "يتم تحضير طلبك وسيصلك قريباً.",
  "cart.backToHome": "العودة للرئيسية",
  "cart.paymentCancelled": "تم إلغاء الدفع",
  "cart.paymentCancelledMsg": "تم إلغاء الدفع. أصناف سلتك ما زالت محفوظة.",

  "card.title": "الدفع بالبطاقة",
  "card.subtitle": "أدخل بيانات بطاقتك لدفع ${amount}",
  "card.number": "رقم البطاقة",
  "card.expiry": "الانتهاء",
  "card.cvc": "CVC",
  "card.nameOnCard": "الاسم على البطاقة",
  "card.fullName": "الاسم الكامل",
  "card.pay": "ادفع ${amount}",
  "card.demo": "🔒 وضع تجريبي — لا يتم خصم أي مبلغ",

  "toast.greatChoice": "اختيار موفق!",
  "toast.greatChoiceMsg": "أول اختيار لك في السلة — تابع التصفح أو أكمل الطلب.",
  "toast.added": "أُضيف إلى السلة",
  "toast.addedMsg": "سلتك بقت أطعم. راجعها أو أضف المزيد.",
  "toast.reviewOrder": "مراجعة الطلب",
  "toast.keepBrowsing": "متابعة التصفح",

  "notif.title": "الإشعارات",
  "notif.empty": "لا يوجد جديد",
  "notif.emptyHint": "تحديثات الطلبات والعروض الجديدة ستظهر هنا.",

  "fav.title": "المفضلة",
  "fav.empty": "لا توجد مفضلات بعد",
  "fav.emptyHint": "اضغط على القلب في أي وجبة أو عرض لحفظه هنا.",
  "fav.meal": "وجبة",
  "fav.deal": "عرض",

  "profile.title": "حسابي",
  "profile.editProfile": "تعديل الحساب",
  "profile.logout": "تسجيل الخروج",
  "profile.logoutTitle": "تسجيل الخروج؟",
  "profile.logoutMsg": "ستحتاج لتسجيل الدخول مرة أخرى لتقديم الطلبات.",
  "profile.stayIn": "البقاء مسجلاً",
  "profile.personalInfo": "المعلومات الشخصية",
  "profile.fullName": "الاسم الكامل",
  "profile.email": "البريد الإلكتروني",
  "profile.phone": "رقم الهاتف",
  "profile.notProvided": "غير محدد",
  "profile.addresses": "العناوين",
  "profile.homeAddress": "عنوان المنزل",
  "profile.workAddress": "عنوان العمل",
  "profile.photoUpdated": "تم تحديث الصورة",
  "profile.photoUpdatedMsg": "صورة حسابك الجديدة ظاهرة الآن.",
  "profile.uploadFailed": "فشل الرفع",

  "edit.title": "تعديل الحساب",
  "edit.changePhotoHint": "غيّر صورتك من صفحة الحساب",
  "edit.enterName": "أدخل اسمك الكامل",
  "edit.enterPhone": "أدخل رقم هاتفك",
  "edit.enterHome": "أدخل عنوان منزلك",
  "edit.enterWork": "أدخل عنوان عملك",
  "edit.updated": "تم تحديث الحساب",
  "edit.updatedMsg": "تم حفظ تغييراتك.",
  "edit.backToProfile": "العودة للحساب",

  "settings.title": "الإعدادات",
  "settings.appearance": "المظهر",
  "settings.light": "فاتح",
  "settings.dark": "داكن",
  "settings.system": "حسب النظام",
  "settings.language": "اللغة",
  "settings.restartHint": "أعد تشغيل التطبيق لتطبيق اتجاه اللغة بالكامل.",

  "auth.welcomeBack": "أهلاً بعودتك",
  "auth.welcomeBackSub": "سجّل الدخول لتكمل طلب أكلك المفضل",
  "auth.createAccount": "إنشاء حساب",
  "auth.createAccountSub": "انضم إلى Foodify — أول توصيلة علينا",
  "auth.email": "البريد الإلكتروني",
  "auth.password": "كلمة المرور",
  "auth.fullName": "الاسم الكامل",
  "auth.yourPassword": "كلمة المرور",
  "auth.min8": "٨ أحرف على الأقل",
  "auth.signIn": "تسجيل الدخول",
  "auth.signUp": "إنشاء حساب",
  "auth.noAccount": "ليس لديك حساب؟",
  "auth.haveAccount": "لديك حساب بالفعل؟",
  "auth.errInvalidCreds": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "auth.errNoUser": "لا يوجد حساب بهذا البريد. سجّل حساباً جديداً أولاً.",
  "auth.errNetwork": "خطأ في الشبكة. تأكد من اتصالك بالإنترنت.",
  "auth.errRateLimit": "محاولات كثيرة جداً. حاول مرة أخرى لاحقاً.",
  "auth.errGeneric": "حدث خطأ ما! حاول مرة أخرى.",
  "auth.errFillFields": "من فضلك املأ كل الحقول",
  "auth.errEmailPassword": "من فضلك أدخل بريدك الإلكتروني وكلمة المرور",
  "auth.errInvalidEmail": "من فضلك أدخل بريداً إلكترونياً صحيحاً",
  "auth.errNameLen": "الاسم يجب أن يكون حرفين على الأقل",
  "auth.errPasswordLen": "كلمة المرور يجب أن تكون ٨ أحرف على الأقل",
  "auth.errEmailExists": "هذا البريد مسجّل بالفعل. استخدم بريداً آخر أو سجّل الدخول.",

  "onb.skip": "تخطي",
  "onb.next": "التالي",
  "onb.getStarted": "ابدأ الآن",
  "onb.1.title": "اكتشف أشهى الأكلات",
  "onb.1.desc": "اطلب وجباتك المفضلة من أفضل المطاعم القريبة منك",
  "onb.2.title": "طلب سريع وسهل",
  "onb.2.desc": "اطلب في ثوانٍ وتابع طلبك لحظة بلحظة",
  "onb.3.title": "توصيل سريع",
  "onb.3.desc": "أكل طازج يوصلك لباب بيتك",
};

const dicts = { en, ar };

const apply = (s: string, vars?: Vars) => {
  if (!vars) return s;
  let out = s;
  for (const k of Object.keys(vars)) out = out.split(`{${k}}`).join(String(vars[k]));
  return out;
};

/** Non-reactive lookup (event handlers, module code). */
export const t = (key: Key, vars?: Vars) => {
  const lang = useLanguageStore.getState().language;
  return apply(dicts[lang][key] ?? en[key] ?? key, vars);
};

/** Reactive hook — components re-render when the language changes. */
export const useT = () => {
  const lang = useLanguageStore((s) => s.language);
  return (key: Key, vars?: Vars) => apply(dicts[lang][key] ?? en[key] ?? key, vars);
};

/**
 * Picks the Arabic value of a piece of Appwrite content (menu item / category
 * name or description) when Arabic is active and a translation exists,
 * falling back to the original (English) value otherwise. Non-reactive —
 * for event handlers / plain functions.
 */
export const localize = (value: string, arValue?: string | null) => {
  const lang = useLanguageStore.getState().language;
  return lang === "ar" && arValue?.trim() ? arValue : value;
};

/** Reactive hook version of `localize` — use inside components. */
export const useLocalize = () => {
  const lang = useLanguageStore((s) => s.language);
  return (value: string, arValue?: string | null) =>
    lang === "ar" && arValue?.trim() ? arValue : value;
};

/**
 * Maps a raw English customization/topping name (as stored on the
 * menu_customizations join snapshot) to Arabic. Kept as a static table
 * because that join collection only stores a denormalized English copy.
 */
const CUSTOMIZATION_NAME_AR: Record<string, string> = {
  Cheese: "جبنة",
  "Jalapeños": "هالبينو",
  Onions: "بصل",
  Olives: "زيتون",
  Mushrooms: "مشروم",
  Tomatoes: "طماطم",
  Bacon: "بيكون",
  Avocado: "أفوكادو",
  Coke: "كوكاكولا",
  Fries: "بطاطس",
  "Garlic Bread": "خبز بالثوم",
  "Chicken Nuggets": "ناجتس دجاج",
  "Iced Tea": "شاي مثلج",
  Salad: "سلطة",
  "Potato Wedges": "بطاطس ويدجز",
  "Mozzarella Sticks": "أصابع موزاريلا",
  "Sweet Corn": "ذرة حلوة",
  "Choco Lava Cake": "تشوكو لافا كيك",
  Rice: "أرز",
  Beans: "فاصوليا",
  Pepperoni: "ببروني",
  "Onion Rings": "حلقات بصل",
  Pickles: "مخلل",
  "Grilled Onions": "بصل مشوي",
  Coleslaw: "كول سلو",
};

export const localizeCustomization = (name: string) => localize(name, CUSTOMIZATION_NAME_AR[name]);

export const useLocalizeCustomization = () => {
  const tr = useLocalize();
  return (name: string) => tr(name, CUSTOMIZATION_NAME_AR[name]);
};
