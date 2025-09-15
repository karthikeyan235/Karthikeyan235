import React from "react";
import phone1 from "../../assets/phone1.png";
import phone2 from "../../assets/phone2.png";
import qrcode from "../../assets/qrcode.png";
import { IoLogoAppleAppstore } from "react-icons/io5"; // App Store icon
import { BiLogoPlayStore } from "react-icons/bi"; // Google Play icon
import { LiaAndroid } from "react-icons/lia"; // APK icon
import { FiZap } from "react-icons/fi"; // TODO: Replace with your feature-specific icon
import { BsShieldCheck } from "react-icons/bs"; // TODO: Replace with your feature-specific icon
import { MdFlashOn } from "react-icons/md"; // TODO: Replace with your feature-specific icon

const MobileApp = () => {
 return (
    <div class="mx-auto py-10 px-5">
        <div className="min-h-screen rounded-2xl shadow w-full bg-gray-50 flex flex-col items-center py-16 px-6">
			{/* Main Title */}
			<h1 className="text-5xl font-semibold sm:mb-20 mb-10 mt-4 text-center bg-gradient-to-r from-purple-500 to-blue-500 py-1.5 text-transparent bg-clip-text">
				Get the App
			</h1>

			{/* Primary Content Section */}
			<div className="w-full max-w-5xl flex flex-col md:flex-row items-center space-x-21 justify-between mb-32">
				{/* App Screenshots */}
				<div className="w-full md:w-1/2 flex justify-center items-center space-x-2 mb-24 ml-22 sm:ml-0 md:mb-52 shadow-[0_70px_70px_-60px_rgba(59,130,246,0.5)]">
					{/* First Phone Image */}
					<div className="w-1/2 h-[420px] overflow-hidden relative">
						<img
							src={phone1}
							alt="App Screenshot 1"
							className="w-full rounded-3xl shadow-xl relative top-14 md:top-0"
						/>
					</div>

					{/* Second Phone Image (Offset Position) */}
					<div className="w-1/2 h-[420px] overflow-hidden relative">
						<img
							src={phone2}
							alt="App Screenshot 2"
							className="w-full rounded-3xl shadow-xl relative top-27"
						/>
					</div>
				</div>

				{/* Feature Highlights and Download Options */}
				<div className="w-full md:w-1/2 flex flex-col items-center px-6">
					{/* Features List */}
					<div className="flex flex-col space-y-12 mb-20 px-5">
						{/* TODO: Replace icon and text with actual feature highlights */}
						<div className="flex items-center space-x-6">
							<FiZap className="w-8 h-8 text-blue-600" />
							<p className="text-gray-600 font-medium text-md">
                                AI-driven Edulearn.ai Chat with you book of your choice
							</p>
						</div>
						<div className="flex items-center space-x-6">
							<BsShieldCheck className="w-8 h-8 text-blue-600" />
							<p className="text-gray-600 font-medium text-md">
                                Create quizzes based on the book’s content and chapters.
							</p>
						</div>
						<div className="flex items-center space-x-6">
							<MdFlashOn className="w-8 h-8 text-blue-600" />
							<p className="text-gray-600 font-medium text-md">
                                Receive instant feedback on quiz performance with detailed scores and analytics
							</p>
						</div>
					</div>

					{/* App Download Options */}
					<div className="flex flex-col items-center space-y-10">
						<div className="flex space-x-7">
							{/* TODO: Uncomment and add valid App Store and Google Play URLs when ready */}
							{/*
							<a href="#" className="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-600 shadow hover:bg-gray-50 transition duration-300">
								<IoLogoAppleAppstore className="w-6 h-6" />
								<span>App Store</span>
							</a>
							<a href="#" className="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-600 shadow hover:bg-gray-50 transition duration-300">
								<BiLogoPlayStore className="w-6 h-6" />
								<span>Google Play</span>
							</a>
							*/}

							{/* APK Download Link (active for now) */}
							<a
								href="https://edutech.blob.core.windows.net/site/Edulearn.apk"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border-2 border-blue-500 text-blue-600 bg-white font-semibold shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:bg-blue-50 transition duration-400">
								<LiaAndroid className="w-6 h-6" />
								<span className="text-sm font-semibold">Download APK</span>
							</a>
						</div>

						{/* QR Code Section */}
						<div className="mt-7 flex flex-col items-center space-y-8">
							<p className="text-gray-600 text-base font-medium text-center">
								Scan the QR to download directly on your Android device
							</p>
							<img
								src={qrcode}
								alt="QR Code"
								className="h-32 w-32 object-cover rounded-xl border border-gray-400 shadow-[0_8px_32px_rgba(59,130,246,0.3)]"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Step-by-step Guide for APK Installation */}
			<div className="w-full max-w-[850px] px-4 sm:px-10 md:px-20 sm:py-16 py-0 mb-20">
				<h2 className="text-3xl sm:text-4xl font-semibold mb-16 sm:mb-28 text-center bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
					Download & Install via APK
				</h2>

				{/* Instruction Steps */}
				<div className="space-y-20 sm:space-y-28 text-gray-800 text-base sm:text-lg">
					{[...Array(5)].map((_, index) => (
						<div key={index}>
							<h3 className="font-bold text-xl sm:text-2xl flex items-start sm:items-center">
								<span className="w-12 h-12 sm:w-16 sm:h-16 mr-6 sm:mr-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xl sm:text-2xl">
									{index + 1}
								</span>
								<span className="mt-2.5 sm:mt-0">
									{
										[
											"Enable Unknown Sources",
											"Download the APK File",
											"Locate & Install the APK",
											"Launch the App",
											"Troubleshooting",
										][index]
									}
								</span>
							</h3>

							<ol className="list-disc pl-6 sm:pl-[7.9rem] mt-8 sm:mt-6 ml-4 sm:ml-0 space-y-3 sm:space-y-4">
								{[
									[
										"Open your device’s Settings.",
										"Navigate to Security or Privacy.",
										"Find Unknown sources or Install unknown apps and toggle it on.",
										"If needed, select the specific app (e.g., your browser) to allow installation.",
									],
									[
										<>
											Tap the <strong>Download APK</strong> button on our
											website{" "}
											{/* TODO: Replace this with actual download page URL */}
											<a
												href="https://edulearn.ai/download"
												className="text-blue-600 underline"
												target="_blank"
												rel="noopener noreferrer">
												edulearn.ai/download
											</a>
										</>,
										"Wait for the download to complete. (It should save in your default Downloads folder.)",
									],
									[
										"Open your File Manager or Downloads app.",
										"Locate the downloaded file, typically named edulearn.apk.",
										"Tap the file, review the permission requests, and tap Install.",
									],
									[
										"After installation, tap Open to launch the app.",
										"Follow any additional on-screen instructions for setup.",
									],
									[
										"If installation fails, ensure you have enough storage and that the APK file downloaded completely.",
										"Restart your device and try again.",
										"For persistent issues, visit our support page or contact our helpdesk.",
									],
								][index].map((item, idx) => (
									<li key={idx}>{item}</li>
								))}
							</ol>
						</div>
					))}
				</div>
			</div>
		</div>
    </div>
 )
}

export default MobileApp;