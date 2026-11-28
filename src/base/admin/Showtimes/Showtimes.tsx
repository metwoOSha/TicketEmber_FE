'use client';

import { useMemo, useState } from 'react';
import Card from '@/components/admin/Card/Card';
import EmptyState from '@/components/admin/EmptyState/EmptyState';
import PageHeader from '@/components/admin/PageHeader/PageHeader';
import Segmented from '@/components/admin/Segmented/Segmented';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useAdminMovies, useHalls, useShowtimeCounts, useShowtimes } from '@/hooks/admin/useAdminData';
import { useAdminUi } from '@/store/admin-ui.store';
import { formatDayLabel, getNextDays } from '@/utils/days';
import ShowtimeForm from './ShowtimeForm';
import Timeline, { type DraftBlock } from './Timeline';
import cls from './Showtimes.module.css';

export default function Showtimes() {
    const dates = useMemo(() => getNextDays(7), []);
    const [date, setDate] = useState(dates[0]);
    const [draft, setDraft] = useState<DraftBlock | null>(null);
    const toast = useAdminUi((s) => s.toast);
    const { data: showtimes, isPending } = useShowtimes(date);
    const { data: counts } = useShowtimeCounts(dates);
    const { data: halls } = useHalls();
    const { data: movies } = useAdminMovies();

    const index = dates.indexOf(date);
    const prevDay = index > 0 ? formatDayLabel(dates[index - 1]) : 'yesterday';
    const empty = showtimes && showtimes.length === 0;

    return (
        <>
            <PageHeader
                title="Showtimes"
                sub="Kyiv time. Each block includes 20 minutes of cleaning after the movie (striped part)."
                actions={
                    <>
                        {/* TODO: POST /admin/showtimes/copy { from, to } */}
                        <Button variant="ghost" size="md" onClick={() => toast('Pick the days to copy to (coming with the backend).')}>
                            Copy this day to…
                        </Button>
                        <Button size="md" href="#new-showtime">
                            <Icon name="plus" size={16} />
                            Add showtime
                        </Button>
                    </>
                }
            />

            <Segmented
                label="Day"
                className={cls.days}
                value={date}
                onChange={setDate}
                options={dates.map((d, i) => ({
                    value: d,
                    label: i === 0 ? `Today, ${formatDayLabel(d).replace('Today · ', '')}` : formatDayLabel(d),
                    count: counts ? (counts[d] ? `${counts[d]} shows` : 'empty') : undefined,
                }))}
            />

            <Card aria-label={`Schedule for ${formatDayLabel(date)}`}>
                {isPending || !halls ? (
                    <div className={cls.loading}>
                        <Skeleton height={320} />
                    </div>
                ) : empty ? (
                    <EmptyState
                        title={`No showtimes on ${formatDayLabel(date)}`}
                        text="The site shows this day as empty. Add showtimes one by one or copy the whole schedule from the day before."
                        actions={
                            <>
                                <Button size="md" href="#new-showtime">
                                    <Icon name="plus" size={16} />
                                    Add showtime
                                </Button>
                                <Button variant="ghost" size="md" onClick={() => toast('Copying a day comes with the backend.')}>
                                    Copy from {prevDay}
                                </Button>
                            </>
                        }
                    />
                ) : (
                    <Timeline date={date} halls={halls} showtimes={showtimes ?? []} draft={draft} />
                )}
            </Card>

            {movies && halls && showtimes && (
                <ShowtimeForm
                    date={date}
                    dates={dates}
                    movies={movies}
                    halls={halls}
                    showtimes={showtimes}
                    onDraft={setDraft}
                    onDate={setDate}
                />
            )}
        </>
    );
}
