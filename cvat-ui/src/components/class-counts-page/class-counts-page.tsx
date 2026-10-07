// Copyright (C) CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Radio from 'antd/lib/radio';
import Spin from 'antd/lib/spin';

interface CountItem {
    label: string;
    type?: string;
    count: number;
}

interface ClassCounts {
    total: number;
    counts: CountItem[];
}

type GroupBy = 'label' | 'type';

function ClassCountsPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [groupBy, setGroupBy] = useState<GroupBy>('label');
    const [data, setData] = useState<ClassCounts | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback((signal?: AbortSignal) => {
        setLoading(true);
        setError(null);
        fetch(`/api/test/tasks/${id}/class-counts?group_by=${groupBy}`, {
            credentials: 'same-origin',
            signal,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then((body: ClassCounts) => setData(body))
            .catch((err: Error) => {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            })
            .finally(() => {
                if (!signal?.aborted) {
                    setLoading(false);
                }
            });
    }, [id, groupBy]);

    useEffect(() => {
        const controller = new AbortController();
        load(controller.signal);
        return () => controller.abort();
    }, [load]);

    const max = data ? Math.max(1, ...data.counts.map((item) => item.count)) : 1;

    let body: JSX.Element;
    if (loading) {
        body = <Spin />;
    } else if (error) {
        body = (
            <Alert
                type='error'
                showIcon
                message='Could not load annotation counts'
                description={error}
                action={<Button onClick={() => load()}>Retry</Button>}
            />
        );
    } else if (!data || data.counts.length === 0) {
        body = <Empty description='This task has no annotations yet' />;
    } else {
        body = (
            <div>
                {data.counts.map((item) => {
                    const name = item.type ? `${item.label} · ${item.type}` : item.label;
                    return (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ width: 240 }}>{name}</span>
                            <div style={{ flex: 1, background: '#f0f0f0', height: 20 }}>
                                <div style={{ width: `${(item.count / max) * 100}%`, background: '#1890ff', height: 20 }} />
                            </div>
                            <span style={{ width: 80, textAlign: 'right' }}>{item.count}</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
            <h2>
                {`Annotations per class — task #${id}`}
                {data ? ` (${data.total} total)` : ''}
            </h2>
            <Radio.Group
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                style={{ marginBottom: 16 }}
            >
                <Radio.Button value='label'>By class</Radio.Button>
                <Radio.Button value='type'>By class and shape type</Radio.Button>
            </Radio.Group>
            {body}
        </div>
    );
}

export default ClassCountsPage;
