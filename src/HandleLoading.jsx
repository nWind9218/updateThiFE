// "use client"

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Heart, Sparkles, Check, Star } from "lucide-react"

// export default function Component() {
//   const [isLoading, setIsLoading] = useState(false)
//   const [isComplete, setIsComplete] = useState(false)

//   const handleClick = () => {
//     if (isLoading || isComplete) return

//     setIsLoading(true)
//     setIsComplete(false)

//     setTimeout(() => {
//       setIsLoading(false)
//       setIsComplete(true)

//       setTimeout(() => {
//         setIsComplete(false)
//       }, 2000)
//     }, 3000)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Trang web của tôi</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//           <div className="bg-white rounded-lg p-6 shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4 text-gray-700">Nội dung 1</h2>
//             <p className="text-gray-600 mb-4">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
//               dolore magna aliqua.
//             </p>
//             <div className="w-full h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg"></div>
//           </div>

//           <div className="bg-white rounded-lg p-6 shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4 text-gray-700">Nội dung 2</h2>
//             <p className="text-gray-600 mb-4">
//               Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
//               consequat.
//             </p>
//             <div className="w-full h-32 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg"></div>
//           </div>
//         </div>

//         <div className="flex justify-center">
//           <motion.button
//             onClick={handleClick}
//             className="px-8 py-4 rounded-full font-semibold text-white text-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             disabled={isLoading}
//           >
//             <div className="flex items-center space-x-2">
//               <Sparkles className="w-5 h-5" />
//               <span>Bấm để xử lý</span>
//             </div>
//           </motion.button>
//         </div>
//       </div>

//       <AnimatePresence>
//         {(isLoading || isComplete) && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

//             <motion.div
//               className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20"
//               initial={{ scale: 0.5, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.5, opacity: 0 }}
//               transition={{ type: "spring", duration: 0.5 }}
//             >
//               <AnimatePresence mode="wait">
//                 {isLoading ? (
//                   <motion.div
//                     key="loading"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="flex flex-col items-center space-y-6"
//                   >
//                     <div className="relative">
//                       <motion.div
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//                         className="w-20 h-20 relative"
//                       >
//                         {[...Array(6)].map((_, i) => (
//                           <motion.div
//                             key={i}
//                             className="absolute w-4 h-4 text-pink-500"
//                             style={{
//                               left: "50%",
//                               top: "50%",
//                               transformOrigin: "50% 40px",
//                               transform: `rotate(${i * 60}deg)`,
//                             }}
//                             animate={{
//                               scale: [1, 1.2, 1],
//                             }}
//                             transition={{
//                               duration: 1,
//                               repeat: Number.POSITIVE_INFINITY,
//                               delay: i * 0.1,
//                             }}
//                           >
//                             <Heart className="w-4 h-4 fill-current -translate-x-1/2 -translate-y-1/2" />
//                           </motion.div>
//                         ))}
//                       </motion.div>

//                       <motion.div
//                         className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
//                         animate={{
//                           scale: [1, 1.5, 1],
//                           rotate: [0, 180, 360],
//                         }}
//                         transition={{
//                           duration: 2,
//                           repeat: Number.POSITIVE_INFINITY,
//                         }}
//                       >
//                         <Star className="w-6 h-6 text-yellow-400 fill-current" />
//                       </motion.div>
//                     </div>

//                     <motion.div
//                       className="text-center"
//                       animate={{ opacity: [1, 0.5, 1] }}
//                       transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
//                     >
//                       <h3 className="text-2xl font-bold text-gray-800 mb-2">Đang xử lý...</h3>
//                       <p className="text-gray-600">Vui lòng chờ một chút nhé! ✨</p>
//                     </motion.div>

//                     <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <motion.div
//                         className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
//                         initial={{ width: "0%" }}
//                         animate={{ width: "100%" }}
//                         transition={{ duration: 3, ease: "easeInOut" }}
//                       />
//                     </div>

//                     <div className="absolute inset-0 pointer-events-none">
//                       {[...Array(8)].map((_, i) => (
//                         <motion.div
//                           key={i}
//                           className="absolute w-2 h-2 bg-pink-300 rounded-full"
//                           style={{
//                             left: `${20 + Math.random() * 60}%`,
//                             top: `${20 + Math.random() * 60}%`,
//                           }}
//                           animate={{
//                             y: [-20, -40, -20],
//                             opacity: [0, 1, 0],
//                             scale: [0, 1, 0],
//                           }}
//                           transition={{
//                             duration: 2,
//                             repeat: Number.POSITIVE_INFINITY,
//                             delay: i * 0.3,
//                           }}
//                         />
//                       ))}
//                     </div>
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     key="complete"
//                     initial={{ opacity: 0, scale: 0.5 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.5 }}
//                     className="flex flex-col items-center space-y-6"
//                   >
//                     <motion.div
//                       className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
//                       initial={{ scale: 0 }}
//                       animate={{ scale: [0, 1.2, 1] }}
//                       transition={{ duration: 0.6, type: "spring" }}
//                     >
//                       <Check className="w-10 h-10 text-green-500" />
//                     </motion.div>

//                     <div className="text-center">
//                       <h3 className="text-2xl font-bold text-gray-800 mb-2">Hoàn thành! 🎉</h3>
//                       <p className="text-gray-600">Xử lý thành công rồi!</p>
//                     </div>

//                     <div className="absolute inset-0 pointer-events-none">
//                       {[...Array(12)].map((_, i) => (
//                         <motion.div
//                           key={i}
//                           className="absolute text-2xl"
//                           style={{
//                             left: `${Math.random() * 100}%`,
//                             top: `${Math.random() * 100}%`,
//                           }}
//                           initial={{ opacity: 0, scale: 0, rotate: 0 }}
//                           animate={{
//                             opacity: [0, 1, 0],
//                             scale: [0, 1, 0],
//                             rotate: [0, 360],
//                             y: [-50, 50],
//                           }}
//                           transition={{
//                             duration: 2,
//                             delay: i * 0.1,
//                           }}
//                         >
//                           {["🎉", "✨", "🌟", "💖", "🎊"][i % 5]}
//                         </motion.div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }
