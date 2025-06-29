import type React from "react"
import * as Icons from "lucide-react"

type IconName = keyof typeof Icons

interface DynamicIconProps extends Icons.LucideProps {
  name: string
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = Icons[name as IconName]

  if (!IconComponent) {
    // Retorna um ícone padrão ou nulo se o nome do ícone for inválido
    return <Icons.HelpCircle {...props} />
  }

  return <IconComponent {...props} />
}

export default DynamicIcon
