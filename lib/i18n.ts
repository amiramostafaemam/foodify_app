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
  "common.error": "Error",
  "common.nameRequired": "Name is required",
  "common.userNotFound": "User not found",
  "common.failedUpdateProfile": "Failed to update profile",
  "common.orderFailed": "Order failed",

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

  // reviews
  "details.reviews": "Reviews",
  "details.reviewsN": "Reviews ({n})",
  "details.noReviews": "No reviews yet",
  "details.noReviewsHint": "Be the first to share what you thought.",
  "details.writeReview": "Write a review",
  "details.editReview": "Edit your review",
  "details.yourRating": "Your rating",
  "details.reviewPlaceholder": "Tell others what you thought (optional)",
  "details.submitReview": "Submit review",
  "details.updateReview": "Update review",
  "details.deleteReview": "Delete review",
  "details.deleteReviewTitle": "Delete this review?",
  "details.deleteReviewMsg": "This can't be undone.",
  "details.ratingRequired": "Please pick a star rating.",
  "details.signInToReviewTitle": "Sign in required",
  "details.signInToReviewMsg": "Sign in to write a review for this item.",

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
  "cart.promoCode": "Promo code",
  "cart.promoPlaceholder": "Enter code",
  "cart.apply": "Apply",
  "cart.remove": "Remove",
  "cart.promoApplied": "\"{code}\" applied",
  "cart.promoInvalid": "This code isn't valid.",
  "cart.promoMinOrder": "This code needs a minimum order of ${amount}.",
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
  "cart.payWithStripeSecure": "Pay securely with Stripe",
  "cart.signInRequiredTitle": "Sign in required",
  "cart.signInRequiredMsg": "Please sign in to place an order.",
  "cart.selectPaymentTitle": "Choose a payment method",
  "cart.selectPaymentMsg":
    "Pick Credit/Debit Card or Cash on Delivery before placing your order.",
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
  "card.cardHolder": "CARD HOLDER",
  "card.expires": "EXPIRES",
  "card.yourName": "YOUR NAME",

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
  "notif.seedWelcomeTitle": "Welcome to Foodify 👋",
  "notif.seedWelcomeBody":
    "Your first delivery is on us — order anything over $30 and delivery is free.",
  "notif.seedOfferTitle": "Summer Combo · 38% off",
  "notif.seedOfferBody":
    "Beef burger, fries and an ice-cold drink for $9.99. This week only.",
  "notif.seedDeliveryTitle": "Faster deliveries near you",
  "notif.seedDeliveryBody":
    "We added two new riders in your area — most orders now arrive in under 25 min.",

  // favorites
  "fav.title": "Favorites",
  "fav.empty": "No favorites yet",
  "fav.emptyHint": "Tap the heart on any meal or deal to save it here.",
  "fav.meal": "Meal",
  "fav.deal": "Deal",

  // orders
  "orders.title": "My Orders",
  "orders.empty": "No orders yet",
  "orders.emptyHint": "Your past orders will show up here once you place one.",
  "orders.total": "Total",
  "orders.deliverTo": "Deliver to",
  "orders.status.pending": "Pending",
  "orders.status.confirmed": "Confirmed",
  "orders.status.preparing": "Preparing",
  "orders.status.on_the_way": "On the way",
  "orders.status.delivered": "Delivered",
  "orders.status.cancelled": "Cancelled",

  // profile
  "profile.title": "Profile",
  "profile.myOrders": "My Orders",
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
  "profile.photoUpdated": "Looking good!",
  "profile.photoUpdatedMsg":
    "Your new profile photo has been saved and is showing on your account now.",
  "profile.uploadFailed": "Upload failed",
  "profile.uploadFailedGeneric": "Could not update your photo.",
  "profile.updatePhotoTitle": "Update your photo",
  "profile.updatePhotoMsg": "Choose a new photo or remove your current one.",
  "profile.changePhoto": "Choose New Photo",
  "profile.removePhoto": "Remove Photo",
  "profile.photoRemoved": "Photo removed",
  "profile.photoRemovedMsg":
    "Your profile picture has been reset to your initials.",

  // edit profile
  "edit.title": "Edit Profile",
  "edit.noUserFound": "No user found",
  "edit.goToSignIn": "Go to Sign In",
  "edit.changePhotoHint": "Change your photo from the Profile screen",
  "edit.enterName": "Enter your full name",
  "edit.enterPhone": "Enter your phone number",
  "edit.enterHome": "Enter your home address",
  "edit.enterWork": "Enter your work address",
  "edit.updated": "Profile updated",
  "edit.updatedMsg": "Your changes have been saved.",
  "edit.backToProfile": "Back to Profile",
  "edit.changePassword": "Change Password",
  "edit.currentPassword": "Current password",
  "edit.newPassword": "New password",
  "edit.confirmNewPassword": "Confirm new password",
  "edit.enterCurrentPassword": "Enter your current password",
  "edit.updatePassword": "Update Password",
  "edit.passwordUpdated": "Password updated",
  "edit.passwordUpdatedMsg": "Your password has been changed successfully.",
  "edit.errCurrentPasswordWrong":
    "Your current password is incorrect. Please try again.",
  "edit.errFillPasswordFields": "Please fill all the password fields",

  // settings
  "settings.title": "Settings",
  "settings.appearance": "Appearance",
  "settings.light": "Light",
  "settings.dark": "Dark",
  "settings.system": "Match system",
  "settings.account": "Account",
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
  "auth.accountCreatedTitle": "Account created!",
  "auth.accountCreatedMsg": "Welcome to Foodify — your account is ready to go.",
  "auth.continueToApp": "Continue",
  "auth.noAccount": "Don't have an account?",
  "auth.haveAccount": "Already have an account?",
  "auth.errInvalidCreds":
    "Invalid email or password. Please check your credentials and try again.",
  "auth.errNoUser": "No account found with this email. Please sign up first.",
  "auth.errNetwork": "Network error. Please check your internet connection.",
  "auth.errRateLimit": "Too many attempts. Please try again later.",
  "auth.errEmailNotFound": "No account found with this email.",
  "auth.errGeneric": "Something went wrong! Please try again.",
  "auth.errFillFields": "Please fill all the fields",
  "auth.errEmailPassword": "Please enter your email and password",
  "auth.errInvalidEmail": "Please enter a valid email address",
  "auth.errNameLen": "Name must be at least 2 characters long",
  "auth.errPasswordLen": "Password must be at least 8 characters long",
  "auth.errPasswordMismatch": "Passwords don't match",
  "auth.confirmPassword": "Confirm password",
  "auth.errEmailExists":
    "This email is already registered. Please use a different email or sign in.",
  "auth.enterName": "Enter your full name",
  "auth.enterEmail": "Enter your email",
  "auth.enterPassword": "Enter your password",
  "auth.enterConfirmPassword": "Re-enter your password",
  "auth.forgotPassword": "Forgot Password?",
  "auth.resetTitle": "Reset your password",
  "auth.resetSub":
    "Enter your email and we'll send you a link to reset your password.",
  "auth.resetSend": "Send reset link",
  "auth.resetSending": "Sending…",
  "auth.resetSentTitle": "Check your email",
  "auth.resetSentMsg": "We've sent a password reset link to {email}.",
  "auth.resetDone": "Done",

  // onboarding
  "onb.skip": "Skip",
  "onb.next": "Next",
  "onb.getStarted": "Get Started",
  "onb.1.title": "Discover Great Food",
  "onb.1.desc": "Find your favorite meals from top restaurants near you",
  "onb.2.title": "Fast & Easy Ordering",
  "onb.2.desc": "Order in seconds and track your food in real time",
  "onb.3.title": "Quick Delivery",
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
  "common.minutes": "دقائق",
  "common.items": "عناصر",
  "common.delivery": "التوصيل",
  "common.min": "دقيقة",
  "common.somethingWrong": "حدث خطأ ما",
  "common.error": "خطأ",
  "common.nameRequired": "الاسم مطلوب",
  "common.userNotFound": "المستخدم غير موجود",
  "common.failedUpdateProfile": "فشل تحديث الحساب",
  "common.orderFailed": "فشل الطلب",

  "tab.home": "الرئيسية",
  "tab.search": "بحث",
  "tab.cart": "السلة",
  "tab.profile": "حسابي",

  "home.morning": "صباح الخير",
  "home.afternoon": "مساء الخير",
  "home.evening": "مساء الخير",
  "home.whatsUp": "مرحباً بك، {name}!",
  "home.craving": "ماذا تشتهي اليوم؟",
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
  "search.subtitle": "ابحث عن طعامك المفضل",
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
  "details.defaultDesc":
    "مُحضَّرة طازجة بمكونات عالية الجودة، وتُوصَل إليك ساخنة.",
  "details.addToCartTotal": "أضف إلى السلة · ${amount}",

  "details.reviews": "التقييمات",
  "details.reviewsN": "التقييمات ({n})",
  "details.noReviews": "لا توجد تقييمات بعد",
  "details.noReviewsHint": "كن أول من يشارك رأيه في هذا الطبق.",
  "details.writeReview": "أضف تقييماً",
  "details.editReview": "تعديل تقييمك",
  "details.yourRating": "تقييمك",
  "details.reviewPlaceholder": "شاركنا رأيك (اختياري)",
  "details.submitReview": "إرسال التقييم",
  "details.updateReview": "تحديث التقييم",
  "details.deleteReview": "حذف التقييم",
  "details.deleteReviewTitle": "هل تريد حذف هذا التقييم؟",
  "details.deleteReviewMsg": "لا يمكن التراجع عن هذا الإجراء.",
  "details.ratingRequired": "يرجى اختيار عدد النجوم.",
  "details.signInToReviewTitle": "يجب تسجيل الدخول",
  "details.signInToReviewMsg": "سجّل الدخول لإضافة تقييم لهذا الطبق.",

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
    "ضاعف البرجر، ضاعف المتعة! برجران مميزان محشوّان بالجبنة والبيكون والخضار الطازجة. مثالي للمشاركة أو لعشاق البرجر.",
  "offerData.pizza-party.title": "حفلة البيتزا",
  "offerData.pizza-party.desc":
    "وقت الحفلة قد بدأ! بيتزا كبيرة محمّلة بإضافاتك المفضلة، مع خبز الثوم ومشروب منعش. مثالية لسهرات العائلة أو مع الأصدقاء!",
  "offerData.burrito-delight.title": "بوريتو ديلايت",
  "offerData.burrito-delight.desc":
    "أضف نكهة مكسيكية أصيلة إلى يومك مع البوريتو! محشو بلحم متبل، أرز، فاصوليا، جبنة، وصلصة طازجة. يُقدَّم مع رقائق التورتيلا والجواكامولي!",

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
  "offerItem.tortillaChips": "رقائق التورتيلا",
  "offerItem.guacamole": "جواكامولي",

  "cart.title": "سلتك",
  "cart.titleN": "سلتك ({n})",
  "cart.empty": "سلتك فارغة",
  "cart.emptyHint": "أضف بعض الأصناف اللذيذة لتبدأ!",
  "cart.browseMenu": "تصفح قائمة الطعام",
  "cart.orderSummary": "ملخص الطلب",
  "cart.subtotalN": "المجموع ({n} عناصر)",
  "cart.discount": "الخصم",
  "cart.promoCode": "كود الخصم",
  "cart.promoPlaceholder": "أدخل الكود",
  "cart.apply": "تطبيق",
  "cart.remove": "إزالة",
  "cart.promoApplied": "تم تطبيق الكود \"{code}\"",
  "cart.promoInvalid": "هذا الكود غير صالح.",
  "cart.promoMinOrder": "هذا الكود يتطلب حداً أدنى للطلب قدره {amount}$.",
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
  "cart.payWithStripeSecure": "ادفع بأمان عبر Stripe",
  "cart.signInRequiredTitle": "تسجيل الدخول مطلوب",
  "cart.signInRequiredMsg": "يرجى تسجيل الدخول لإتمام طلبك.",
  "cart.selectPaymentTitle": "يرجى اختيار طريقة الدفع",
  "cart.selectPaymentMsg":
    "اختر الدفع بالبطاقة أو الدفع عند الاستلام قبل تأكيد الطلب.",
  "cart.orderConfirmed": "تم تأكيد الطلب!",
  "cart.orderConfirmedMsg": "يتم تحضير طلبك وسيصلك قريباً.",
  "cart.backToHome": "العودة للرئيسية",
  "cart.paymentCancelled": "تم إلغاء الدفع",
  "cart.paymentCancelledMsg": "تم إلغاء الدفع. أصناف سلتك ما زالت محفوظة.",

  "card.title": "الدفع بالبطاقة",
  "card.subtitle": "أدخل بيانات بطاقتك لدفع ${amount}",
  "card.number": "رقم البطاقة",
  "card.expiry": "تاريخ الانتهاء",
  "card.cvc": "CVC",
  "card.nameOnCard": "الاسم على البطاقة",
  "card.fullName": "الاسم الكامل",
  "card.pay": "ادفع ${amount}",
  "card.demo": "🔒 وضع تجريبي — لا يتم خصم أي مبلغ",
  "card.cardHolder": "حامل البطاقة",
  "card.expires": "تنتهي في",
  "card.yourName": "اسمك",

  "toast.greatChoice": "اختيار موفق!",
  "toast.greatChoiceMsg": "أول اختيار لك في السلة — تابع التصفح أو أكمل الطلب.",
  "toast.added": "أُضيف إلى السلة",
  "toast.addedMsg": "أصبحت سلتك أشهى. يمكنك مراجعتها أو إضافة المزيد.",
  "toast.reviewOrder": "مراجعة الطلب",
  "toast.keepBrowsing": "متابعة التصفح",

  "notif.title": "الإشعارات",
  "notif.empty": "لا يوجد جديد",
  "notif.emptyHint": "تحديثات الطلبات والعروض الجديدة ستظهر هنا.",
  "notif.seedWelcomeTitle": "أهلاً بك في Foodify 👋",
  "notif.seedWelcomeBody":
    "أول عملية توصيل مجانية على حسابنا — اطلب بمبلغ يزيد عن ٣٠$ ليكون التوصيل مجاناً.",
  "notif.seedOfferTitle": "كومبو الصيف · خصم ٣٨٪",
  "notif.seedOfferBody":
    "برجر لحم، بطاطس مقرمشة، ومشروب مثلج مقابل ٩.٩٩$. هذا الأسبوع فقط.",
  "notif.seedDeliveryTitle": "توصيل أسرع في منطقتك",
  "notif.seedDeliveryBody":
    "أضفنا مندوبين جدد في منطقتك — أصبحت معظم الطلبات تصل في أقل من ٢٥ دقيقة.",

  "fav.title": "المفضلة",
  "fav.empty": "لا توجد مفضلات بعد",
  "fav.emptyHint": "اضغط على القلب في أي وجبة أو عرض لحفظه هنا.",
  "fav.meal": "وجبة",
  "fav.deal": "عرض",

  // orders
  "orders.title": "طلباتي",
  "orders.empty": "لا توجد طلبات بعد",
  "orders.emptyHint": "طلباتك السابقة ستظهر هنا بعد تقديم أول طلب.",
  "orders.total": "الإجمالي",
  "orders.deliverTo": "التوصيل إلى",
  "orders.status.pending": "قيد الانتظار",
  "orders.status.confirmed": "تم التأكيد",
  "orders.status.preparing": "قيد التحضير",
  "orders.status.on_the_way": "في الطريق",
  "orders.status.delivered": "تم التوصيل",
  "orders.status.cancelled": "ملغي",

  "profile.title": "حسابي",
  "profile.myOrders": "طلباتي",
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
  "profile.photoUpdated": "صورة رائعة!",
  "profile.photoUpdatedMsg":
    "تم حفظ صورتك الجديدة، وهي تظهر الآن في حسابك.",
  "profile.uploadFailed": "فشل الرفع",
  "profile.uploadFailedGeneric": "تعذر تحديث صورتك.",
  "profile.updatePhotoTitle": "تحديث صورتك",
  "profile.updatePhotoMsg": "اختر صورة جديدة أو احذف الصورة الحالية.",
  "profile.changePhoto": "اختيار صورة جديدة",
  "profile.removePhoto": "حذف الصورة",
  "profile.photoRemoved": "تم حذف الصورة",
  "profile.photoRemovedMsg":
    "تمت إعادة صورة حسابك إلى الحرف الأول من اسمك.",

  "edit.title": "تعديل الحساب",
  "edit.noUserFound": "لم يتم العثور على المستخدم",
  "edit.goToSignIn": "الذهاب لتسجيل الدخول",
  "edit.changePhotoHint": "غيّر صورتك من صفحة الحساب",
  "edit.enterName": "أدخل اسمك الكامل",
  "edit.enterPhone": "أدخل رقم هاتفك",
  "edit.enterHome": "أدخل عنوان منزلك",
  "edit.enterWork": "أدخل عنوان عملك",
  "edit.updated": "تم تحديث الحساب",
  "edit.updatedMsg": "تم حفظ تغييراتك.",
  "edit.backToProfile": "العودة للحساب",
  "edit.changePassword": "تغيير كلمة المرور",
  "edit.currentPassword": "كلمة المرور الحالية",
  "edit.newPassword": "كلمة المرور الجديدة",
  "edit.confirmNewPassword": "تأكيد كلمة المرور الجديدة",
  "edit.enterCurrentPassword": "أدخل كلمة المرور الحالية",
  "edit.updatePassword": "تحديث كلمة المرور",
  "edit.passwordUpdated": "تم تحديث كلمة المرور",
  "edit.passwordUpdatedMsg": "تم تغيير كلمة المرور بنجاح.",
  "edit.errCurrentPasswordWrong": "كلمة المرور الحالية غير صحيحة. حاول مرة أخرى.",
  "edit.errFillPasswordFields": "يرجى ملء جميع حقول كلمة المرور",

  "settings.title": "الإعدادات",
  "settings.appearance": "المظهر",
  "settings.light": "فاتح",
  "settings.dark": "داكن",
  "settings.system": "حسب النظام",
  "settings.account": "الحساب",
  "settings.language": "اللغة",
  "settings.restartHint": "أعد تشغيل التطبيق لتطبيق اتجاه اللغة بالكامل.",

  "auth.welcomeBack": "أهلاً بعودتك",
  "auth.welcomeBackSub": "سجّل الدخول لمتابعة طلب طعامك المفضل",
  "auth.createAccount": "إنشاء حساب",
  "auth.createAccountSub": "انضم إلى Foodify — أول توصيلة علينا",
  "auth.email": "البريد الإلكتروني",
  "auth.password": "كلمة المرور",
  "auth.fullName": "الاسم الكامل",
  "auth.yourPassword": "كلمة المرور",
  "auth.min8": "٨ أحرف على الأقل",
  "auth.signIn": "تسجيل الدخول",
  "auth.signUp": "إنشاء حساب",
  "auth.accountCreatedTitle": "تم إنشاء الحساب!",
  "auth.accountCreatedMsg": "أهلاً بك في Foodify — حسابك جاهز الآن.",
  "auth.continueToApp": "متابعة",
  "auth.noAccount": "ليس لديك حساب؟",
  "auth.haveAccount": "لديك حساب بالفعل؟",
  "auth.errInvalidCreds": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "auth.errNoUser": "لا يوجد حساب بهذا البريد. سجّل حساباً جديداً أولاً.",
  "auth.errNetwork": "خطأ في الشبكة. تأكد من اتصالك بالإنترنت.",
  "auth.errRateLimit": "محاولات كثيرة جداً. حاول مرة أخرى لاحقاً.",
  "auth.errEmailNotFound": "لا يوجد حساب مسجل بهذا البريد الإلكتروني.",
  "auth.errGeneric": "حدث خطأ ما! حاول مرة أخرى.",
  "auth.errFillFields": "يرجى ملء جميع الحقول",
  "auth.errEmailPassword": "يرجى إدخال بريدك الإلكتروني وكلمة المرور",
  "auth.errInvalidEmail": "يرجى إدخال بريد إلكتروني صحيح",
  "auth.errNameLen": "يجب أن يتكون الاسم من حرفين على الأقل",
  "auth.errPasswordLen": "يجب أن تتكون كلمة المرور من ٨ أحرف على الأقل",
  "auth.errPasswordMismatch": "كلمتا المرور غير متطابقتين",
  "auth.confirmPassword": "تأكيد كلمة المرور",
  "auth.errEmailExists": "هذا البريد مسجّل بالفعل. استخدم بريداً آخر أو سجّل الدخول.",
  "auth.enterName": "أدخل اسمك الكامل",
  "auth.enterEmail": "أدخل بريدك الإلكتروني",
  "auth.enterPassword": "أدخل كلمة المرور",
  "auth.enterConfirmPassword": "أعد إدخال كلمة المرور",
  "auth.forgotPassword": "هل نسيت كلمة المرور؟",
  "auth.resetTitle": "استرجاع كلمة المرور",
  "auth.resetSub":
    "أدخل بريدك الإلكتروني وسنرسل إليك رابطاً لإعادة تعيين كلمة المرور.",
  "auth.resetSend": "إرسال رابط الاسترجاع",
  "auth.resetSending": "جارٍ الإرسال…",
  "auth.resetSentTitle": "افحص بريدك الإلكتروني",
  "auth.resetSentMsg": "لقد أرسلنا رابط استرجاع كلمة المرور إلى {email}.",
  "auth.resetDone": "تم",

  "onb.skip": "تخطي",
  "onb.next": "التالي",
  "onb.getStarted": "ابدأ الآن",
  "onb.1.title": "اكتشف ألذ الأطعمة",
  "onb.1.desc": "اطلب وجباتك المفضلة من أفضل المطاعم القريبة منك",
  "onb.2.title": "طلب سريع وسهل",
  "onb.2.desc": "اطلب في ثوانٍ وتابع طلبك لحظة بلحظة",
  "onb.3.title": "توصيل سريع",
  "onb.3.desc": "طعام طازج يصل إلى باب منزلك",
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
  // The seeded topping is actually named "Extra Cheese" (lib/data.ts), not
  // "Cheese" — this lookup is an exact match, so a key that doesn't match
  // the real stored name silently falls through untranslated. This was
  // the one topping doing that; every other name here already matches.
  "Extra Cheese": "جبنة إضافية",
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
