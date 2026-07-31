import { useState, type FormEvent } from 'react'

import { submitAttack } from '../../api/attacks'
import type {
	ModelInfo,
	StrategyName,
	SubmitAttackRequest,
	SubmitAttackResponse,
} from '../../api/types'
import { validateAttackRequestWithZod } from '../../features/attack/validation'

interface AttackComposerProps {
	models: ModelInfo[]
}

export function AttackComposer({ models }: AttackComposerProps) {
	const [objective, setObjective] = useState('')
	const [selectedModels, setSelectedModels] = useState<string[]>([])
	const [strategy, setStrategy] = useState<StrategyName>('template')
	const [temperature, setTemperature] = useState(0.7)
	const [maxTurns, setMaxTurns] = useState(10)
	const [seed, setSeed] = useState('')
	const [authorizedUse, setAuthorizedUse] = useState(false)

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errors, setErrors] = useState<string[]>([])
	const [result, setResult] = useState<SubmitAttackResponse | null>(null)

	function toggleModel(modelId: string) {
		setSelectedModels((current) =>
			current.includes(modelId)
				? current.filter((id) => id !== modelId)
				: [...current, modelId],
		)
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const payload: SubmitAttackRequest = {
			objective: objective.trim(),
			models: selectedModels,
			strategy,
			temperature,
			max_turns: maxTurns,
			seed: seed.trim() === '' ? null : Number(seed),
		}

		const nextErrors = validateAttackRequestWithZod(payload, authorizedUse)
		setErrors(nextErrors)
		setResult(null)

		if (nextErrors.length > 0) {
			return
		}

		setIsSubmitting(true)

		try {
			const response = await submitAttack(payload)
			setResult(response)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error'
			setErrors([message])
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className="attack-composer">
			<h2>Create an Evaluation Job</h2>
			<p className="form-intro">
				Configure an authorized defensive evaluation. Submission calls the backend
				contract endpoint.
			</p>

			<form onSubmit={handleSubmit}>
				<label className="form-field">
					<span>Evaluation objective</span>
					<textarea
						value={objective}
						maxLength={1000}
						rows={5}
						placeholder="Describe a safe, authorized evaluation objective"
						onChange={(event) => setObjective(event.target.value)}
						disabled={isSubmitting}
					/>
					<small>{objective.length}/1000</small>
				</label>

				<fieldset className="form-field">
					<legend>Target models</legend>
					<div className="model-options">
						{models.map((model) => (
							<label className="model-option" key={model.id}>
								<input
									type="checkbox"
									checked={selectedModels.includes(model.id)}
									onChange={() => toggleModel(model.id)}
									disabled={isSubmitting}
								/>
								<span>
									<strong>{model.id}</strong>
									<small>{model.huggingface_id}</small>
								</span>
							</label>
						))}
					</div>
				</fieldset>

				<div className="form-grid">
					<label className="form-field">
						<span>Strategy</span>
						<select
							value={strategy}
							onChange={(event) => setStrategy(event.target.value as StrategyName)}
							disabled={isSubmitting}
						>
							<option value="template">Template</option>
							<option value="reactive">Reactive</option>
							<option value="gemini">Gemini</option>
						</select>
					</label>

					<label className="form-field">
						<span>Max turns</span>
						<input
							type="number"
							min={2}
							max={20}
							value={maxTurns}
							onChange={(event) => setMaxTurns(Number(event.target.value))}
							disabled={isSubmitting}
						/>
					</label>

					<label className="form-field">
						<span>Temperature: {temperature.toFixed(1)}</span>
						<input
							type="range"
							min={0}
							max={2}
							step={0.1}
							value={temperature}
							onChange={(event) => setTemperature(Number(event.target.value))}
							disabled={isSubmitting}
						/>
					</label>

					<label className="form-field">
						<span>Seed (optional)</span>
						<input
							type="number"
							step={1}
							value={seed}
							placeholder="Random"
							onChange={(event) => setSeed(event.target.value)}
							disabled={isSubmitting}
						/>
					</label>
				</div>

				<label className="authorization-check">
					<input
						type="checkbox"
						checked={authorizedUse}
						onChange={(event) => setAuthorizedUse(event.target.checked)}
						disabled={isSubmitting}
					/>
					<span>
						I will use this tool only for authorized, defensive evaluation and will not
						submit secrets or personal data.
					</span>
				</label>

				<button className="submit-button" type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Submitting...' : 'Launch Evaluation'}
				</button>
			</form>

			{errors.length > 0 && (
				<div className="form-message error-message" role="alert">
					<strong>Submission blocked</strong>
					<ul>
						{errors.map((error) => (
							<li key={error}>{error}</li>
						))}
					</ul>
				</div>
			)}

			{result && (
				<div className="form-message success-message">
					<strong>Job accepted</strong>
					<dl>
						<div><dt>Job ID</dt><dd>{result.job_id}</dd></div>
						<div><dt>Status</dt><dd>{result.status}</dd></div>
						<div><dt>Strategy</dt><dd>{result.strategy}</dd></div>
						<div><dt>Models</dt><dd>{result.models.join(', ')}</dd></div>
					</dl>
				</div>
			)}
		</section>
	)
}
