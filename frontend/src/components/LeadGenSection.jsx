import axios from "axios";
import { CheckCircle, Mail, MapPin, Phone, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import useGeocoding from "../hooks/useGeocoding";

const ORGANIZATION_ID = "7b6adf42-78a8-47cd-92d0-4aa7bbd8c090";

const LeadGenSection = () => {
	const [step, setStep] = useState(1); // 1: form, 2: loading, 3: success
	const [isExpanded, setIsExpanded] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [leadId, setLeadId] = useState(null);
	const [countryCode, setCountryCode] = useState("+47");
	const [formData, setFormData] = useState({
		address: "",
		name: "",
		phone: "",
		email: "",
		additionalData: {
			interests: ["Korttid", "Heimby"],
			mapbox: null,
		},
		organizationId: ORGANIZATION_ID,
	});
	const [addressFocused, setAddressFocused] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);

	const {
		suggestions,
		isLoading: geoLoading,
		error: geoError,
		searchAddress,
		clearSuggestions,
	} = useGeocoding({ limit: 5, debounceMs: 300, country: "no" });
	const sectionRef = useRef(null);

	// Scroll to center of section when step changes
	useEffect(() => {
		if (step === 2 || step === 3) {
			setTimeout(() => {
				if (sectionRef.current) {
					sectionRef.current.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
				}
			}, 100);
		}
	}, [step]);

	const countryCodes = [
		{ code: "+47", country: "Norge", flag: "🇳🇴" },
		{ code: "+1", country: "USA/Canada", flag: "🇺🇸" },
		{ code: "+44", country: "UK", flag: "🇬🇧" },
		{ code: "+49", country: "Tyskland", flag: "🇩🇪" },
		{ code: "+33", country: "Frankrike", flag: "🇫🇷" },
		{ code: "+34", country: "Spania", flag: "🇪🇸" },
		{ code: "+31", country: "Nederland", flag: "🇳🇱" },
		{ code: "+46", country: "Sverige", flag: "🇸🇪" },
		{ code: "+45", country: "Danmark", flag: "🇩🇰" },
		{ code: "+358", country: "Finland", flag: "🇫🇮" },
	];

	const createInitialLead = async (address) => {
		try {
			const leadData = {
				address: address,
				name: "",
				email: "",
				phone: "",
				note: "",
				source: getUtmSource(),
				additionalData: formData.additionalData || {
					interests: ["Korttid", "Heimby"],
				},
				organizationId: ORGANIZATION_ID,
			};

			const response = await axios.post(
				`https://api.proptonomy.ai/api/leads`,
				leadData,
			);

			if (response.data && response.data.id) {
				setLeadId(response.data.id);
				console.debug("Initial lead created:", response.data.id);
			}
		} catch (err) {
			console.error("Error creating initial lead:", err);
			// Silent fail - don't show error to user for initial lead creation
		}
	};

	const updateLead = async () => {
		if (!leadId) return;

		try {
			const leadData = {
				address: formData.address || "",
				name: formData.name || "",
				email: formData.email || "",
				phone: formData.phone ? `${countryCode} ${formData.phone}` : "",
				note: "",
				source: getUtmSource(),
				additionalData: formData.additionalData || {
					interests: ["Korttid", "Heimby"],
				},
				organizationId: ORGANIZATION_ID,
			};

			await axios.patch(
				`https://api.proptonomy.ai/api/leads/${leadId}/update`,
				leadData,
			);

			console.debug("Lead updated:", leadId);
		} catch (err) {
			console.error("Error updating lead:", err);
			// Silent fail - don't show error to user for updates
		}
	};

	const handleAddressChange = (e) => {
		const value = e.target.value;
		setFormData({ ...formData, address: value });
		if (value && !isExpanded) {
			setIsExpanded(true);
		}
		searchAddress(value);
		setSelectedIndex(-1);
	};

	const handleAddressBlur = async () => {
		setAddressFocused(false);
		// Delay to allow click on suggestion before clearing
		setTimeout(() => {
			clearSuggestions();
			setSelectedIndex(-1);
		}, 150);
		if (formData.address && !leadId) {
			await createInitialLead(formData.address);
		}
	};

	const handleAddressFocus = () => {
		setAddressFocused(true);
	};

	const handleSuggestionSelect = (s) => {
		const addressText = s?.raw?.properties?.full_address || s?.label || "";
		const props = s?.raw?.properties;

		// Extract only the necessary data from Mapbox response
		const mapboxData = props
			? {
					full_address: props.full_address,
					coordinates: props.coordinates
						? {
								longitude: props.coordinates.longitude,
								latitude: props.coordinates.latitude,
								accuracy: props.coordinates.accuracy,
							}
						: null,
					place: props.context?.place?.name || null,
					region: props.context?.region?.name || null,
				}
			: null;

		const updatedAdditional = {
			...(formData.additionalData || {}),
			mapbox: mapboxData,
		};
		setFormData((prev) => ({
			...prev,
			address: addressText,
			additionalData: updatedAdditional,
		}));
		clearSuggestions();
		setSelectedIndex(-1);
		if (!isExpanded) setIsExpanded(true);
	};

	const handleAddressKeyDown = (e) => {
		if (suggestions.length === 0) return;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((prev) =>
				prev < suggestions.length - 1 ? prev + 1 : prev,
			);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
		} else if (e.key === "Enter" && selectedIndex >= 0) {
			e.preventDefault();
			handleSuggestionSelect(suggestions[selectedIndex]);
		} else if (e.key === "Escape") {
			clearSuggestions();
			setSelectedIndex(-1);
		}
	};

	const handleChange = (field) => (e) => {
		const newValue = e.target.value;
		setFormData({ ...formData, [field]: newValue });
	};

	const handleFieldBlur = () => async () => {
		if (leadId) {
			await updateLead();
		}
	};

	/**
	 * Get UTM parameters from URL for lead source tracking
	 */
	function getUtmSource() {
		const params = new URLSearchParams(window.location.search);
		const utmSource = params.get("utm_source");
		const utmMedium = params.get("utm_medium");
		const utmCampaign = params.get("utm_campaign");

		if (utmSource || utmMedium || utmCampaign) {
			return (
				[utmSource, utmMedium, utmCampaign].filter(Boolean).join(" / ") +
				" / Heimby.no"
			);
		}

		// Check referrer
		if (document.referrer) {
			try {
				const referrerUrl = new URL(document.referrer);
				if (referrerUrl.hostname !== window.location.hostname) {
					return `Referrer: ${referrerUrl.hostname} / Heimby.no`;
				}
			} catch {
				// Invalid URL, ignore
			}
		}

		return "Organic / Heimby.no";
	}

	const handleLeadSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess(false);

		try {
			const leadData = {
				name: formData.name || "",
				address: formData.address || "",
				email: formData.email || "",
				phone: formData.phone ? `${countryCode} ${formData.phone}` : "",
				note: "",
				source: getUtmSource(),
				submittedAt: new Date().toISOString(),
				additionalData: formData.additionalData || {
					interests: ["Korttid", "Heimby"],
				},
				organizationId: ORGANIZATION_ID,
			};

			// Final submission - always POST with submittedAt
			const response = await axios.post(
				`https://api.proptonomy.ai/api/leads`,
				leadData,
			);

			if (response.status >= 200 && response.status < 300) {
				console.debug("Lead successfully submitted");
				setSuccess(true);
				// Reset form after 5 seconds
				setTimeout(() => {
					setSuccess(false);
					setFormData({
						address: "",
						name: "",
						phone: "",
						email: "",
					});
					setIsExpanded(false);
					setLeadId(null);
				}, 5000);
			}
		} catch (err) {
			console.error("Lead submission error:", err);
			let errorMessage = "Kunne ikke sende inn. Vennligst prøv igjen.";

			if (err.response?.data?.detail) {
				if (Array.isArray(err.response.data.detail)) {
					errorMessage = err.response.data.detail.map((e) => e.msg).join(", ");
				} else if (typeof err.response.data.detail === "string") {
					errorMessage = err.response.data.detail;
				}
			} else if (err.message) {
				errorMessage = err.message;
			}

			setError(errorMessage);
		}
	};

	// const handleOwnerPortalCreation = async () => {
	//   setStep(2); // Show loading

	//   try {
	//     const ownerData = {
	//       address: formData.address,
	//       name: formData.name,
	//       phone: `${countryCode} ${formData.phone}`,
	//       email: formData.email,
	//       password: "temp_password_" + Date.now(), // Generate temporary password for magic link
	//     };

	//     const response = await axios.post(`${API}/owner-portal`, ownerData, {
	//       validateStatus: function (status) {
	//         return status < 500; // Don't throw for 4xx errors
	//       },
	//     });

	//     // Check if user already exists
	//     if (response.status === 400) {
	//       window.location.href = "/login";
	//       return;
	//     }

	//     if (!response.data || !response.data.id) {
	//       throw new Error("Ugyldig svar fra serveren");
	//     }

	//     localStorage.setItem(
	//       "ownerProperty",
	//       JSON.stringify({
	//         id: response.data.id,
	//         address: formData.address,
	//         property_address: formData.address,
	//         name: formData.name,
	//         email: formData.email,
	//         phone: formData.phone,
	//         onboarding_completed: response.data.onboarding_completed || false,
	//       })
	//     );

	//     setTimeout(() => {
	//       setStep(3);
	//     }, 1500);
	//   } catch (err) {
	//     console.error("Owner portal creation error:", err);
	//     let errorMessage =
	//       "Kunne ikke opprette eierportal. Vennligst prøv igjen.";

	//     // Check if error is about existing user
	//     if (err.response && err.response.status === 400) {
	//       window.location.href = "/login";
	//       return;
	//     }

	//     if (err.response?.data?.detail) {
	//       if (Array.isArray(err.response.data.detail)) {
	//         errorMessage = err.response.data.detail.map((e) => e.msg).join(", ");
	//       } else if (typeof err.response.data.detail === "string") {
	//         errorMessage = err.response.data.detail;
	//       }
	//     } else if (err.message) {
	//       errorMessage = err.message;
	//     }

	//     setError(errorMessage);
	//     setStep(1);
	//   }
	// };

	// const handleGoToPortal = () => {
	//   window.location.href = "/owner-portal";
	// };

	return (
		<section
			id="lead-gen"
			ref={sectionRef}
			className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6"
			style={{ backgroundColor: "#F9F8F4" }}
		>
			<div className="max-w-6xl mx-auto">
				{step === 1 ? (
					<>
						<div className="bg-gray-50 rounded-3xl p-8 sm:p-10 md:p-12 shadow-lg border border-gray-200 max-w-5xl mx-auto">
							<div className="text-center mb-8 sm:mb-10 space-y-3 sm:space-y-4">
								<h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-600 tracking-tight">
									Eneste som tilbyr både
								</h2>
								<div className="flex flex-wrap items-center justify-center gap-2 text-base sm:text-lg text-gray-500">
									<span>Airbnb og langtidsutleie</span>
								</div>
								<p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 font-semibold pt-2 sm:pt-4">
									Sjekk hvor mye du kan tjene med oss
								</p>
							</div>

							<form onSubmit={handleLeadSubmit} className="relative">
								{error && (
									<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
										{error}
									</div>
								)}
								{success && (
									<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
										Takk for din henvendelse! Vi vil snart ta kontakt.
									</div>
								)}
								<div
									className={`grid gap-4 transition-all duration-500 ease-in-out ${
										isExpanded
											? "grid-cols-1 md:grid-cols-2 opacity-100"
											: "grid-cols-1 opacity-100"
									}`}
									style={{
										maxHeight: isExpanded ? "500px" : "80px",
									}}
								>
									<div
										className={`relative ${
											isExpanded ? "md:col-span-2" : "col-span-1"
										}`}
									>
										<div className="relative">
											<MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
											<input
												type="text"
												value={formData.address}
												onChange={handleAddressChange}
												onFocus={handleAddressFocus}
												onBlur={handleAddressBlur}
												onKeyDown={handleAddressKeyDown}
												placeholder="Skriv inn adressen din"
												style={{ backgroundColor: "#FFFFFF" }}
												className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
												required
											/>
											{(addressFocused || formData.address) &&
												suggestions.length > 0 && (
													<div className="absolute left-0 right-0 mt-2 z-20 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-auto">
														{suggestions.map((s, index) => (
															<button
																type="button"
																key={s.id}
																onMouseDown={(e) => e.preventDefault()}
																onClick={() => handleSuggestionSelect(s)}
																onMouseEnter={() => setSelectedIndex(index)}
																className={`w-full text-left px-4 py-3 transition-colors ${
																	index === selectedIndex
																		? "bg-gray-100"
																		: "hover:bg-gray-50"
																}`}
															>
																<div className="text-sm text-gray-900">
																	{s.label}
																</div>
																{s.secondary ? (
																	<div className="text-xs text-gray-500 mt-0.5">
																		{s.secondary}
																	</div>
																) : null}
															</button>
														))}
														{geoLoading && (
															<div className="px-4 py-3 text-sm text-gray-500">
																Søker adresser…
															</div>
														)}
														{geoError && !geoLoading && (
															<div className="px-4 py-3 text-sm text-red-600">
																{geoError}
															</div>
														)}
													</div>
												)}
										</div>
									</div>

									{isExpanded && (
										<>
											<div className="relative animate-fade-in">
												<div className="relative">
													<User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
													<input
														type="text"
														value={formData.name}
														onChange={handleChange("name")}
														onBlur={handleFieldBlur("name")}
														placeholder="Ditt navn"
														style={{ backgroundColor: "#FFFFFF" }}
														className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
														required
													/>
												</div>
											</div>

											<div className="relative animate-fade-in">
												<div className="relative flex gap-2">
													<select
														value={countryCode}
														onChange={(e) => setCountryCode(e.target.value)}
														style={{ backgroundColor: "#FFFFFF" }}
														className="w-32 pl-3 pr-2 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
													>
														{countryCodes.map((country) => (
															<option key={country.code} value={country.code}>
																{country.flag} {country.code}
															</option>
														))}
													</select>
													<div className="relative flex-1">
														<Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
														<input
															type="tel"
															value={formData.phone}
															onChange={handleChange("phone")}
															onBlur={handleFieldBlur("phone")}
															placeholder="Telefonnummer"
															style={{ backgroundColor: "#FFFFFF" }}
															className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
															required
														/>
													</div>
												</div>
											</div>

											<div className="relative animate-fade-in md:col-span-2">
												<div className="relative">
													<Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
													<input
														type="email"
														value={formData.email}
														onChange={handleChange("email")}
														onBlur={handleFieldBlur("email")}
														placeholder="E-postadresse"
														style={{ backgroundColor: "#FFFFFF" }}
														className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
														required
													/>
												</div>
											</div>

											<div className="md:col-span-2 animate-fade-in">
												<button
													type="submit"
													className="w-full py-4 bg-gray-900 text-white rounded-2xl text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
												>
													Beregn mine inntekter
												</button>
											</div>
										</>
									)}
								</div>

								{!isExpanded && (
									<p className="text-center text-sm text-gray-500 mt-4 animate-fade-in">
										Begynn å skrive for å se dine potensielle inntekter
									</p>
								)}
							</form>
						</div>
					</>
				) : step === 2 ? (
					<>
						<div className="text-center py-16 animate-fade-in">
							<div className="flex flex-col items-center space-y-6">
								<div className="relative">
									<div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
								</div>
								<p className="text-lg text-gray-600 font-light">
									Oppretter eierportalen din...
								</p>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="text-center py-8 animate-fade-in">
							<div className="flex flex-col items-center space-y-8">
								<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
									<CheckCircle className="w-12 h-12 text-green-600" />
								</div>

								<div className="space-y-3">
									<h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
										Eierportal opprettet
									</h2>
									<p className="text-xl text-gray-600 font-light">
										Kontoen din er klar.
									</p>
								</div>

								<button
									onClick={handleGoToPortal}
									className="px-10 py-4 bg-gray-900 text-white rounded-2xl text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
								>
									Gå til Eierportal
								</button>

								<div className="mt-8 p-6 bg-gray-50 rounded-2xl max-w-md">
									<p className="text-sm text-gray-600">
										En bekreftelsese-post har blitt sendt til{" "}
										<span className="font-medium">{formData.email}</span>
									</p>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</section>
	);
};

export default LeadGenSection;
