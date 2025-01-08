import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Finding, Severity } from "@/types/findings";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function getSeverityVariant(severity: Severity) {
    const variants = {
        [Severity.NONE]: 'secondary',
        [Severity.LOW]: 'success',
        [Severity.MEDIUM]: 'warning',
        [Severity.HIGH]: 'destructive',
        [Severity.SEVERE]: 'destructive'
    } as const;
    return variants[severity];
}

function getSeverityLabel(severity: Severity) {
    const labels = {
        [Severity.NONE]: 'Normal',
        [Severity.LOW]: 'Leve',
        [Severity.MEDIUM]: 'Moderada',
        [Severity.HIGH]: 'Alta',
        [Severity.SEVERE]: 'Grave'
    };
    return labels[severity];
}

export default function AchadoCard({
    achado,
    onEdit,
    onDelete
}: {
    achado: Finding,
    onEdit: () => void,
    onDelete: () => void
}) {
    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600">
            {/* Top status bar showing severity */}
            <div className={cn(
                "h-1 rounded-t-lg",
                {
                    'bg-green-500': achado.severity === Severity.LOW,
                    'bg-yellow-500': achado.severity === Severity.MEDIUM,
                    'bg-red-500': achado.severity === Severity.HIGH,
                    'bg-purple-500': achado.severity === Severity.SEVERE,
                    'bg-gray-300': achado.severity === Severity.NONE,
                }
            )} />

            <div className="p-4">
                {/* Header with pathology and actions */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {achado.pathology}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {achado.system} • {achado.organ}
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onEdit}
                            className="h-8 w-8 p-0"
                        >
                            <EditIcon sx={{ fontSize: 20 }} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDelete}
                            className="h-8 w-8 p-0 hover:text-destructive"
                        >
                            <DeleteIcon sx={{ fontSize: 20 }} />
                        </Button>
                    </div>
                </div>

                {/* Observations */}
                {achado.observations && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {achado.observations}
                    </p>
                )}

                {/* Image thumbnail if exists */}
                {achado.image_url && (
                    <div className="relative h-32 mb-4 rounded-md overflow-hidden">
                        <Image
                            src={achado.image_url}
                            alt="Finding image"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Footer with metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {achado.created_by?.fullName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{achado.created_by?.fullName}</p>
                            <p>{formatDate(achado.created_at)}</p>
                        </div>
                    </div>
                    <Badge variant={getSeverityVariant(achado.severity)}>
                        {getSeverityLabel(achado.severity)}
                    </Badge>
                </div>
            </div>
        </div>
    )
}