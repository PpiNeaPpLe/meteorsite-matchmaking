interface Attribute {
  label: string
  value: string
}

interface ProfileAttributesProps {
  attributes: Attribute[]
}

export default function ProfileAttributes({ attributes }: ProfileAttributesProps) {
  return (
    <div className="space-y-2">
      {attributes.map((attr, index) => (
        <div key={index} className="flex justify-between">
          <span className="text-sm text-muted-foreground">{attr.label}:</span>
          <span className="text-sm font-medium">{attr.value}</span>
        </div>
      ))}
    </div>
  )
}
