import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Finding, Severity } from "@/types/findings";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function getSeverityLabel(severity: Severity) {
    const labels = {
        [Severity.NONE]: 'Informativo',
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
        <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200">
            <div className={cn(
                "h-1 rounded-t-lg",
                {
                    'bg-yellow-300': achado.severity === Severity.LOW,
                    'bg-amber-500': achado.severity === Severity.MEDIUM,
                    'bg-rose-500': achado.severity === Severity.HIGH,
                    'bg-black': achado.severity === Severity.SEVERE,
                    'bg-blue-300': achado.severity === Severity.NONE,
                }
            )} />

            <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="text-base font-medium text-slate-900">
                            {achado.pathology}
                        </h3>
                        <p className="text-xs text-slate-600">
                            {achado.system} • {achado.organ}
                        </p>
                    </div>

                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onEdit}
                            className="h-7 w-7 p-0"
                        >
                            <EditIcon className="h-3.5 w-3.5 text-slate-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDelete}
                            className="h-7 w-7 p-0 hover:text-rose-500"
                        >
                            <DeleteIcon className="h-3.5 w-3.5 text-slate-600" />
                        </Button>
                    </div>
                </div>

                {achado.observations && (
                    <p className="text-xs text-slate-700 mb-2 line-clamp-2">
                        {achado.observations}
                    </p>
                )}

                {achado.image_url && (
                    <div className="relative h-24 mb-2 rounded overflow-hidden bg-slate-50">
                        <Image
                            src={achado.image_url}
                            alt="Finding image"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2 mt-2">
                    <div className="flex items-center gap-1.5">
                        <Avatar className="h-6 w-6 bg-slate-100">
                            <AvatarFallback className="text-xs text-slate-600">
                                {achado.created_by?.fullName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-slate-700 text-xs">{achado.created_by?.fullName}</p>
                            <p className="text-slate-500 text-xs">{formatDate(achado.created_at)}</p>
                        </div>
                    </div>
                    <Badge
                        variant="custom"
                        className={cn(
                            "text-xs px-1.5 py-0.5",
                            {
                                'bg-yellow-300 text-white': achado.severity === Severity.LOW,
                                'bg-amber-500 text-white': achado.severity === Severity.MEDIUM,
                                'bg-rose-500 text-white': achado.severity === Severity.HIGH,
                                'bg-black text-white': achado.severity === Severity.SEVERE,
                                'bg-blue-300 text-white': achado.severity === Severity.NONE,
                            }
                        )}>
                        {getSeverityLabel(achado.severity)}
                    </Badge>
                </div>
            </div>
        </div>
    )
}